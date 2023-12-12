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
        name: '',
        amount:'',
        unitMain: ''
    });

    let tableData = [];

    useEffect(() => {
        // Fetch storage data based on storageId
        const fetchDostawa = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/dostawa/${dostawaId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
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
        setEntry({
            ...entry,
            [e.target.name]: e.target.value,
        });
        if(e.target.name == "name"){
            setEntry({
                ...entry,
                unitMain: polProdukty.find((p)=> p._id == e.target.value).unitMain,
            });
        }
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

    const columns = [
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Ilość sztuk", field:"amount", headerTooltip:true, headerSort:false},
        {title:"Jednostka Główna", field:"unitMain", headerTooltip:true, headerSort:false},
    ];

    if(dostawa){
        //console.log(dostawa)
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
                        name="name"
                        value={entry.name}
                        onChange={handleInputChange}
                    >
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
