import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import RemoveDostawaModal from './RemoveDostawaModal.js';
import { Button } from 'reactstrap';

const DatePicker : React.FC = ({ dostawy, setData }) => {

    function handleInputChange(e){
        let id = e.target.value;
        setData(id)
        
    }

    return (
      <select className="form-control selectpicker m-2" data-live-search="true" id="selectSPProduct" onChange={(e) => handleInputChange(e)}>
        <option value="-1">Wybierz inny dzień:</option>
        {dostawy &&
          dostawy.map((_dostawa) => (
            <option key={_dostawa.name} value={_dostawa._id}>
              {_dostawa.name}
            </option>
          ))}
      </select>
    );
  };

const Dostawa: React.FC = () => {
    const navigate = useNavigate();
    const [dostawyData, setdostawyData] = useState<any[]>([]); // Initialize state for products_data
    const [dostawaId, setdostawyId] = useState(null); // Initialize state for products_data
    const [showModal, setShowModal] = useState(false);
    const [removeModalData, setRemoveModalData] = useState({id: '', name: ''});

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/dostawa', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                //console.log(data);
                setdostawyData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const removeIcon = function (cell, formatterParams, onRendered) {
        return '<i class="fa-solid fa-trash customColor-red">remove</i>';
    };

    const editIcon = function (cell, formatterParams, onRendered) {
        return '<i class="fa-solid fa-pen-to-square customColor-yellow">edit</i>';

    };

    const redirectToEditPage = function() {
        let id = dostawaId;
        navigate(`/Dostawa/edit/${id}`);
    }

    const cellRemove = (cell) => {
        let cellData = cell.getRow().getData();
        //console.log(cellData);
        setRemoveModalData({id: cellData._id, name: cellData.name});
        setShowModal(true);
    }

    const columns = [
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title:"Ilość sztuk", field:"amount", headerTooltip:true, headerSort:false},
        {title:"Jednostka Główna", field:"unitMain", headerTooltip:true, headerSort:false},
    ];
    let tableData;
    let dostawa = dostawyData.filter((row) => row._id == dostawaId).find(() => true)
        if(dostawa)
            tableData = dostawa.polProdukty.map((p, ind) => ({...p, amount: dostawa.pPAmountJG[ind]}));
        else
            tableData = []

    // Define other functions here...

    return (
        <div>
            <RemoveDostawaModal
                isVisible={showModal}
                setVisible={setShowModal} 
                name={removeModalData.name} 
                id={removeModalData.id}
            />
            <DatePicker dostawy={dostawyData} setData={setdostawyId}/>
            <ReactTabulator
                columns={columns}
                data={tableData}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
            />
            {dostawaId && <Button className='btn-primary float-end' onClick={redirectToEditPage}>Edit</Button>}
            {/* Your other JSX goes here */}
        </div>
    );
};

export default Dostawa;
