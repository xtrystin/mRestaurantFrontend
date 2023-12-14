import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import RemovePracownikModal from './RemovePracownikModal.js';

const Pracownicy: React.FC = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState<any[]>([]); // Initialize state for products_data
    const [showModal, setShowModal] = useState(false);
    const [removeModalData, setRemoveModalData] = useState({ id: '', name: '' });
    const [cell, setCell] = useState(null);

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/pracownik', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();

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
        navigate(`/pracownicy/edit/${id}`);
    }

    const cellRemove = (cell) => {
        let cellData = cell.getRow().getData();
        //console.log(cellData);
        setRemoveModalData({ id: cellData._id, name: cellData.fName + " " + cellData.lName });
        setCell(cell)
        setShowModal(true);
    }

    const columns = [
        {title:"Imię", field:"fName"},
          {title:"Nazwisko", field:"lName"},
          {title:"Rola", field:"role"},
          {title:"Login", field:"login"},
          {title:"Email", field:"email"},
          {title:"Adres", field:"address"},
          {title:"Edytuj", formatter:editIcon, width:80, hozAlign:"center", cellClick:function(e, cell){redirectToEditPage(e, cell)}},
          {title:"Usuń", formatter:"buttonCross", width:80, hozAlign:"center", cellClick:function(e, cell){cellRemove(cell)}},
    ];

    // Define other functions here...

    return (
        <div>
            <RemovePracownikModal
                isVisible={showModal}
                setVisible={setShowModal}
                cell={cell}
                setCell={setCell}
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

export default Pracownicy;
