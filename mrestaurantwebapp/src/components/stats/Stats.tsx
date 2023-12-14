import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { ReactTabulator } from 'react-tabulator';
import authService from '../auth/AuthorizeService.js';
import { useNavigate } from 'react-router-dom';
import { ApiUrl } from '../../Consts.js';
import { Spinner, Col, Row } from 'react-bootstrap';
import DatePicker from '../DatePicker.js';

const Stats: React.FC = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState<any[]>([]); // Initialize state for products_data
    const [statsId, setStatsId] = useState(null); // Initialize state for products_data
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Your async function
        const fetchData = async () => {
            try {
                const url = ApiUrl;
                const response = await fetch(url + '/api/statystki', {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                }); // Replace 'your_api_endpoint' with your actual API endpoint
                const data = await response.json();
                console.log(data);
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to run the effect only once on mount

    const colorCell = function (cell, formatterParams, onRendered) {
        let data = cell.getRow().getData();
        let color = (data.deviation >= 100) ? "text-success" : (data.deviation <= -100)? "text-danger" : "";
        return `<div class="${color} h-100">${data.deviation}</div>`;
    };

    const columns2 = [
        {title:"_id", field:"_id", headerTooltip:true, headerSort:false, visible:false},
        {title:"Nazwa", field:"name", headerTooltip:true, headerSort:false},
        {title: "Current Day", headerHozAlign: "center", columns:[
            {title:"JG", field:"actualDay.pPAmountJG", headerTooltip:true, headerSort:false},
            {title:"PJ", field:"actualDay.pPAmountPJ", headerTooltip:true, headerSort:false},
            {title:"J", field:"actualDay.pPAmountJ", headerTooltip:true, headerSort:false},
        ]},
        {title: "Previous Day", headerHozAlign: "center", columns:[
            {title:"JG", field:"prevDay.pPAmountJG", headerTooltip:true, headerSort:false},
            {title:"PJ", field:"prevDay.pPAmountPJ", headerTooltip:true, headerSort:false},
            {title:"J", field:"prevDay.pPAmountJ", headerTooltip:true, headerSort:false},
        ]},
        {title:"Deviation", field:"deviation", headerTooltip:true, headerSort:false, formatter: colorCell},
    ];

    let currStats = statsData.filter((row) => row.name == statsId).find(() => true);
    let tableData2 = [];
        if(currStats)
            tableData2 = currStats.stats.map((p, ind) => ({
        ...p,
        
    }));
    // Define other functions here...

    return (
        <div>
            <DatePicker days={statsData} setData={setStatsId} loading={statsData.length == 0}/>
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
            {/* Your other JSX goes here */}
        </div>
    );
};

export default Stats;
