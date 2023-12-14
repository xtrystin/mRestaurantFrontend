import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import { Button, Row, Col } from 'reactstrap';
import DatePicker from '../DatePicker.js';

const Sales: React.FC = () => {
    const navigate = useNavigate();
    const [salesData, setSalesData] = useState<any[]>([]); // Initialize state for products_data
    const [saleId, setSaleId] = useState(null); // Initialize state for products_data
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/sprzedaz', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                console.log(data);
                setSalesData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const prodEdited = (cell)=>{
        let data = cell.getRow().getData();
        let index = cell.getRow().getPosition() - 1;
        let dayIndex = salesData.findIndex((d) => d._id == saleId);
        let updatedDay = {...salesData[dayIndex]};
        updatedDay.ProduktyAmount[index] = data.amount;
        salesData[dayIndex] = updatedDay;
        setSalesData(salesData)
        console.log(data);
    }

    const columns = [
        {title:"_id", field:"_id", headerTooltip:true, headerSort:false, visible:false},
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Ilość sztuk", editor:"number", field:"amount", headerTooltip:true, headerSort:false, cellEdited:(cell) => prodEdited(cell)},
    ];
    let tableData = [];
    let strata = salesData.filter((row) => row._id == saleId).find(() => true)
    if(strata)
        tableData = strata.Produkty.map((p, ind) => ({...p, amount: strata.ProduktyAmount[ind]}));

    const handleUpdate = async ()=>{
        let strata = salesData.filter((row) => row._id == saleId).find(() => true)
        let updateData = {
            ProduktyAmount: strata.ProduktyAmount
        }
        console.log(updateData)
        try {
            const response = await fetch(ApiUrl + `/api/sprzedaze/${saleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                console.log('sprzedaze updated successfully');
                navigate("/sprzedaz");
            } else {
                console.error('Failed to update sprzedaze');
                setErrorMsg("Failed to update sprzedaze");
            }
        } catch (error) {
            console.error('Error updating sprzedaze:', error);
            setErrorMsg("Error updating sprzedaze: " + error);
        }
    }

    // Define other functions here...

    return (
        <div>
            <Row>
                <Col> <DatePicker days={salesData} setData={setSaleId} loading={salesData.length == 0}/> </Col> 
                <Col md={"auto"}> {saleId && <Button className='btn-primary float-end' onClick={handleUpdate}>Confirm</Button>} </Col>
            </Row>
            
            {errorMsg && <p className='text-danger'>{errorMsg}</p>}
            <ReactTabulator
                columns={columns}
                data={tableData}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
            />
            
            
            {/* Your other JSX goes here */}
        </div>
    );
};

export default Sales;
