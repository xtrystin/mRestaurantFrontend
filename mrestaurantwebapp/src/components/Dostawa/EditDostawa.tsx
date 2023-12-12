import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import { useNavigate } from 'react-router-dom';
import { ReactTabulator } from 'react-tabulator';

const EditDostawa: React.FC = () => {
    const dostawaId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const [dostawa, setDostawa] = useState(null);
    const [polProdukty, setPolProdukty] = useState([]);

    const [entry, setEntry] = useState({
        id: '',
        name: '',
        amount:0,
        unitMain: ''
    });

    useEffect(() => {
        // Fetch storage data based on storageId
        const fetchDostawa = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/dostawa/${dostawaId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                let data = await response.json();
                //console.log(data)
                setDostawa(data);

                const response2 = await fetch(ApiUrl + '/api/polprodukt', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const productData = await response2.json();
                setPolProdukty(productData);
                
            } catch (error) {
                console.error('Error fetching storage:', error);
                setErrorMsg("Error fetching storage: " + error);
            }
        };

        fetchDostawa();

    }, [dostawaId]);

    const handleInputChange = (e) => {
        if(e.target.name == "id"){
            let pprodukt = polProdukty.find((p)=> p._id == e.target.value)
            setEntry({
                ...entry,
                unitMain: pprodukt.unitMain,
                name: pprodukt.name,
                id: e.target.value
            });
        }
        else
            setEntry({
                ...entry,
                [e.target.name]: e.target.value
            });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/dostawa/${dostawaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(dostawa),
            });

            if (response.ok) {
                console.log('dostawa updated successfully');
                navigate("/dostawa");
            } else {
                console.error('Failed to update dostawa');
                setErrorMsg("Falied to update dostawa");
            }
        } catch (error) {
            console.error('Error updating dostawa:', error);
            setErrorMsg("Error updating dostawa: " + error);
        }
    };

    const handleAddEntry = () => {
        if(entry.name && entry.amount > 0){
          let newProdukt = {
            id: entry.id,
            name: entry.name,
            unitMain: entry.unitMain
            }
            setDostawa({
                ...dostawa,
                polProdukty: dostawa.polProdukty.concat(newProdukt),
                pPAmountJG: dostawa.pPAmountJG.concat(entry.amount - 0)
            })  
        }
    }

    const cellRemove = (cell) => {
        let cellData = cell.getRow().getData();
        //console.log(cellData);
        let index = dostawa.polProdukty.findIndex(p => p._id == cellData._id);
        setDostawa({
            ...dostawa,
            polProdukty: dostawa.polProdukty.filter((p, idx) => idx != index),
            pPAmountJG: dostawa.pPAmountJG.filter((p, idx) => idx != index),
        })
    }

    const removeIcon = function (cell, formatterParams, onRendered) {
        return '<i class="fa-solid fa-trash customColor-red">remove</i>';
    };

    const columns = [
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Ilość sztuk", field:"amount", headerTooltip:true, headerSort:false},
        {title:"Jednostka Główna", field:"unitMain", headerTooltip:true, headerSort:false},
        {title:"Usuń", formatter:removeIcon, width:80, hozAlign:"center", headerTooltip:true, cellClick:function(e, cell){cellRemove(cell)}},
    ];

    let tableData = [];
    if(dostawa){
        console.log(dostawa)
        tableData = dostawa.polProdukty.map((p, ind) => ({...p, amount: dostawa.pPAmountJG[ind]}));
    }
    else
        tableData = []

    const productOptions = [];
    for(let product of polProdukty){
        productOptions.push(<option value={product._id} key={product._id}>{product.name}</option>)
        //mapOfStorages.set(storage._id, {name: storage.name, shortcut: storage.shortcut});
    }
    

    return (
        <div>
            <h2>Edit entry</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formEntryName">
                    <Form.Label>Polproduct name</Form.Label>
                    <Form.Select
                        name="id"
                        value={entry.id}
                        onChange={handleInputChange}
                    >
                        <option value={-1} key={-1}>Wybierz półprodukt</option>
                        {productOptions}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEntryName">
                    <Form.Label>Polproduct unit</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Unit"
                        name="unitMain"
                        value={entry.unitMain}
                        disabled
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEntryAmount">
                    <Form.Label>Polproduct amount</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter amount"
                        name="amount"
                        value={entry.amount}
                        onChange={handleInputChange}
                    />
                </Form.Group>


                {errorMsg && <p className='text-danger'>{errorMsg}</p>}

                <Button variant="primary" onClick={handleUpdate}>
                    Confirm
                </Button>

                <Button variant="success" className='float-end' onClick={handleAddEntry}>
                    Add entry
                </Button>
            </Form>

            <ReactTabulator
                columns={columns}
                data={tableData}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
            />
            
        </div>
    );
};

export default EditDostawa;
