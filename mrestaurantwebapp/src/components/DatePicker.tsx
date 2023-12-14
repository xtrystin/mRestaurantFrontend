import React, { useEffect, useState } from 'react';
import 'react-tabulator/lib/styles.css'; // Import the styles
import 'react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css'; // Import the Bootstrap theme
import { Row, Col, Spinner } from 'react-bootstrap';

const DatePicker : React.FC = ({ days, setData, loading}) => {

    function handleInputChange(e){
        let id = e.target.value;
        setData(id)
    }

    return (
    <Row>
        <Col >
        <select className="form-control selectpicker" data-live-search="true" id="selectSPProduct" onChange={(e) => handleInputChange(e)}>
            <option value="">Wybierz inny dzień: </option>
            {days &&
            days.map((_day) => (
                <option key={_day.name} value={_day._id}>
                {_day.name}
                </option>
            ))}
        </select>
      </Col>
      {loading && <Col sm="auto"> <Spinner animation="border" variant='primary' as={"span"} /></Col>}
    </Row>
    );
  };

  export default DatePicker;