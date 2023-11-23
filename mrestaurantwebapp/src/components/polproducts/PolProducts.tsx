import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import RemovePolProductModal from './RemovePolProductModal.tsx';

const PolProducts: React.FC = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState<any[]>([]); // Initialize state for products_data
    const [showModal, setShowModal] = useState(false);
    const [removeModalData, setRemoveModalData] = useState({id: '', name: ''});

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                //Szymon coś tu nakombinował, dodatkowe pobieranie magazynów do pokazania i łączenie ich do tabeli
                const response1 = await fetch(url + '/api/magazyn', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint

                const storageData = await response1.json();
                const mapOfStorages = new Map();
                for(let storage of storageData){
                    mapOfStorages.set(storage._id, {name: storage.name, shortcut: storage.shortcut});
                }

                const response = await fetch(url + '/api/polprodukt', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();

                let i = 0;
                for(let _data of data){
                    data[i].magazynName = mapOfStorages.get(data[i].magazyn).name;
                    data[i].magazynShortcut = mapOfStorages.get(data[i].magazyn).shortcut;
                    i++;
                }

                setTableData(data);
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

    const redirectToEditPage = function(e, cell) {
        let id = cell.getRow().getData()._id;
        navigate(`/polproducts/edit/${id}`);
    }

    const cellRemove = (cell) => {
        let cellData = cell.getRow().getData();
        //console.log(cellData);
        setRemoveModalData({id: cellData._id, name: cellData.name});
        setShowModal(true);
    }

    const columns = [
        {title:"Nazwa", field:"name", headerTooltip:true},
            {title:"Magazyn", field:"magazynName", headerTooltip:true},
            {title:"Jednostka Główna", field:"unitMain", headerTooltip:true},
            {title:"PodJednostka", field:"unitSub", headerTooltip:true},
            {title:"Ilość PJ w JG", field:"multiplayerSubToMain", headerTooltip:true},
            {title:"Jednostka", field:"unit", headerTooltip:true},
            {title:"Ilość J w PJ", field:"multiplayerUnitToSub", headerTooltip:true},
            {title:"Edytuj", formatter:editIcon, width:80, hozAlign:"center", headerTooltip:true, cellClick:function(e, cell){redirectToEditPage(e, cell)}},
            {title:"Usuń", formatter:removeIcon, width:80, hozAlign:"center", headerTooltip:true, cellClick:function(e, cell){cellRemove(cell)}},
    ];

    // Define other functions here...

    return (
        <div>
            <RemovePolProductModal
                isVisible={showModal}
                setVisible={setShowModal} 
                name={removeModalData.name} 
                id={removeModalData.id}
            />
            <ReactTabulator
                columns={columns}
                data={tableData}
                tooltips={true}
                layout={'fitColumns'}
                pagination={'local'}
                paginationSize={20}
                paginationSizeSelector={[10, 20, 30, 40, 50]}
                initialSort={[
                    { column: 'magazynName', dir: 'asc' },
                ]}
            />
            {/* Your other JSX goes here */}
        </div>
    );
};

export default PolProducts;
