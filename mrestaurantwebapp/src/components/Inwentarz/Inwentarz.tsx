import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import { Button } from 'reactstrap';

const DatePicker : React.FC = ({ inw, setData }) => {

    function handleInputChange(e){
        let id = e.target.value;
        setData(id)
    }

    return (
      <select className="form-control selectpicker m-2" data-live-search="true" id="selectSPProduct" onChange={(e) => handleInputChange(e)}>
        <option value="-1">Wybierz inny dzień:</option>
        {inw &&
          inw.map((inw) => (
            <option key={inw.name} value={inw._id}>
              {inw.name}
            </option>
          ))}
      </select>
    );
  };

const Inwentarz: React.FC = () => {
    const navigate = useNavigate();
    const [inwData, setInwData] = useState<any[]>([]); // Initialize state for products_data
    const [inwId, setInwId] = useState(null); // Initialize state for products_data
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/inwentarz', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                console.log(data);
                setInwData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const ppEdited = (cell)=>{
        let data = cell.getRow().getData();
        let index = cell.getRow().getPosition() - 1;
        let dayIndex = inwData.findIndex((d) => d._id == inwId);
        let updatedDay = {...inwData[dayIndex]};
        updatedDay.pPAmountJ[index] = data.amountU;
        updatedDay.pPAmountJG[index] = data.amountUM;
        updatedDay.pPAmountPJ[index] = data.amountUS;
        inwData[dayIndex] = updatedDay;
        setInwData(inwData)
        console.log(data);
    }

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

    let currInw = inwData.filter((row) => row._id == inwId).find(() => true);
    let tableData2 = [];
        if(currInw)
            tableData2 = currInw.polProdukty.map((p, ind) => ({
        ...p,
        amountUM: currInw.pPAmountJG[ind],
        amountUS: currInw.pPAmountPJ[ind],
        amountU: currInw.pPAmountJ[ind]
    }));

    const handleUpdate = async ()=>{
        let currInw = inwData.filter((row) => row._id == inwId).find(() => true)
        let updateData = {
            pPAmountJG: currInw.pPAmountJG,
            pPAmountPJ: currInw.pPAmountPJ,
            pPAmountJ: currInw.pPAmountJ,
        }
        console.log(updateData)
        try {
            const response = await fetch(ApiUrl + `/api/inwentarz/${inwId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                console.log('inwentarz updated successfully');
                navigate("/inwentarz");
            } else {
                console.error('Failed to update inwentarz');
                setErrorMsg("Failed to update inwentarz");
            }
        } catch (error) {
            console.error('Error updating inwentarz:', error);
            setErrorMsg("Error updating inwentarz: " + error);
        }
    }

    // Define other functions here...

    return (
        <div>
            <DatePicker inw={inwData} setData={setInwId}/>
            {errorMsg && <p className='text-danger'>{errorMsg}</p>}

            <ReactTabulator
                columns={columns2}
                data={tableData2}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
                
            />
            {inwId && <Button className='btn-primary float-end' onClick={handleUpdate}>Confirm</Button>}
            {/* Your other JSX goes here */}
        </div>
    );
};

export default Inwentarz;
