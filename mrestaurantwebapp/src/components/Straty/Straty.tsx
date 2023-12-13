import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import { Button } from 'reactstrap';

const DatePicker : React.FC = ({ straty, setData }) => {

    function handleInputChange(e){
        let id = e.target.value;
        setData(id)
    }

    return (
      <select className="form-control selectpicker m-2" data-live-search="true" id="selectSPProduct" onChange={(e) => handleInputChange(e)}>
        <option value="-1">Wybierz inny dzień:</option>
        {straty &&
          straty.map((_strata) => (
            <option key={_strata.name} value={_strata._id}>
              {_strata.name}
            </option>
          ))}
      </select>
    );
  };

const Straty: React.FC = () => {
    const navigate = useNavigate();
    const [stratyData, setStratyData] = useState<any[]>([]); // Initialize state for products_data
    const [strataId, setStrataId] = useState(null); // Initialize state for products_data
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/straty', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                console.log(data);
                setStratyData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const prodEdited = (cell)=>{
        let data = cell.getRow().getData();
        let index = cell.getRow().getPosition() - 1;
        let dayIndex = stratyData.findIndex((d) => d._id == strataId);
        let updatedDay = {...stratyData[dayIndex]};
        updatedDay.ProduktyAmount[index] = data.amount;
        stratyData[dayIndex] = updatedDay;
        setStratyData(stratyData)
        console.log(data);
    }

    const ppEdited = (cell)=>{
        let data = cell.getRow().getData();
        let index = cell.getRow().getPosition() - 1;
        let dayIndex = stratyData.findIndex((d) => d._id == strataId);
        let updatedDay = {...stratyData[dayIndex]};
        updatedDay.pPAmountJ[index] = data.amountU;
        updatedDay.pPAmountJG[index] = data.amountUM;
        updatedDay.pPAmountPJ[index] = data.amountUS;
        stratyData[dayIndex] = updatedDay;
        setStratyData(stratyData)
        console.log(data);
    }

    const columns = [
        {title:"_id", field:"_id", headerTooltip:true, headerSort:false, visible:false},
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Ilość sztuk", editor:"number", field:"amount", headerTooltip:true, headerSort:false, cellEdited:(cell) => prodEdited(cell)},
    ];
    let tableData;
    let strata = stratyData.filter((row) => row._id == strataId).find(() => true)
        if(strata)
            tableData = strata.Produkty.map((p, ind) => ({...p, amount: strata.ProduktyAmount[ind]}));
        else
            tableData = []

    const columns2 = [
        {title:"_id", field:"_id", headerTooltip:true, headerSort:false, visible:false},
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Straty J.G.", editor:"number", field:"amountUM", headerTooltip:true, headerSort:false, cellEdited:(cell)=>ppEdited(cell)},
        {title:"Jednostka Główna", field:"unitMain", headerTooltip:true, headerSort:false},
        {title:"Straty P.J.", editor:"number", field:"amountUS", headerTooltip:true, headerSort:false, cellEdited:(cell)=>ppEdited(cell)},
        {title:"PodJednostka", field:"unitSub", headerTooltip:true, headerSort:false},
        {title:"Straty J.", editor:"number", field:"amountU", headerTooltip:true, headerSort:false, cellEdited:(cell)=>ppEdited(cell)},
        {title:"Jednostka", field:"unit", headerTooltip:true, headerSort:false},
    ];
    let tableData2;
        if(strata)
            tableData2 = strata.polProdukty.map((p, ind) => ({
        ...p,
        amountUM: strata.pPAmountJG[ind],
        amountUS: strata.pPAmountPJ[ind],
        amountU: strata.pPAmountJ[ind]
    }));
        else
            tableData2 = []

    const handleUpdate = async ()=>{
        let strata = stratyData.filter((row) => row._id == strataId).find(() => true)
        let updateData = {
            pPAmountJG: strata.pPAmountJG,
            pPAmountPJ: strata.pPAmountPJ,
            pPAmountJ: strata.pPAmountJ,
            ProduktyAmount: strata.ProduktyAmount
        }
        console.log(updateData)
        try {
            const response = await fetch(ApiUrl + `/api/straty/${strataId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                console.log('straty updated successfully');
                navigate("/straty");
            } else {
                console.error('Failed to update straty');
                setErrorMsg("Failed to update straty");
            }
        } catch (error) {
            console.error('Error updating straty:', error);
            setErrorMsg("Error updating straty: " + error);
        }
    }

    // Define other functions here...

    return (
        <div>
            <DatePicker straty={stratyData} setData={setStrataId}/>
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

            <ReactTabulator
                columns={columns2}
                data={tableData2}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
                
            />
            {strataId && <Button className='btn-primary float-end' onClick={handleUpdate}>Confirm</Button>}
            {/* Your other JSX goes here */}
        </div>
    );
};

export default Straty;
