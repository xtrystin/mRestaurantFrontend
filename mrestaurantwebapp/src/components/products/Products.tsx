import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.tsx';
import RemoveProductModal from './RemoveProductModal.tsx';

const Products: React.FC = () => {
    const navigate = useNavigate();
    const [productsData, setProductsData] = useState<any[]>([]); // Initialize state for products_data
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [removeProductData, setRemoveProductData] = useState({id: '', name: ''});

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/produkt', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                setProductsData(data);
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
        navigate(`/products/edit/${id}`);
    }

    const cellRemove = (cell) => {
        let cellData = cell.getRow().getData();
        //console.log(cellData);
        setRemoveProductData({id: cellData._id, name: cellData.name});
        setShowRemoveModal(true);
    }

    const columns = [
        { title: '_id', field: '_id', visible: false, headerTooltip: true },
        { title: 'Nazwa Produktu', field: 'name', headerTooltip: true },
        { title: 'Cena', field: 'price', headerTooltip: true },
        { title: 'Wyłączony', field: 'isDisabled', width: 80, headerTooltip: true, formatter: 'tickCross', sorter: 'boolean', hozAlign: 'center' },
        { title: 'Edytuj', formatter: editIcon, width: 80, hozAlign: 'center', cellClick: (e, cell) => redirectToEditPage(e, cell) },
        { title: 'Usuń', formatter: removeIcon, width: 80, hozAlign: 'center', headerTooltip: true, cellClick: (e, cell) => cellRemove(cell) },
    ];

    // Define other functions here...

    return (
        <div>
            <RemoveProductModal
                isVisible={showRemoveModal}
                setVisible={setShowRemoveModal} 
                product_name={removeProductData.name} 
                product_id={removeProductData.id}
            />
            <ReactTabulator
                columns={columns}
                data={productsData}
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

export default Products;
