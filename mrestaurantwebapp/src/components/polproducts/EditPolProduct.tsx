import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import { useNavigate } from 'react-router-dom';

const EditPolProduct: React.FC = () => {
    const polProductId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const [polProduct, setPolProduct] = useState({
        name: '',
        unitMain: 'KOSZ',
        unitSub: 'WOREK',
        unit: 'SZTUKA',
        multiplayerSubToMain: 1,
        multiplayerUnitToSub: 1,
        magazyn: '63b9a91edacdd31b36169979',
    });

    const [magazyny, setMagazyny] = useState([]);

    useEffect(() => {
        // Fetch polProduct data based on polProductId
        let add = searchParams.get('add');

        const fetchPolProduct = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/polprodukt/${polProductId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
                setPolProduct(data);
            } catch (error) {
                console.error('Error fetching polProduct:', error);
                setErrorMsg("Error fetching polProduct: " + error);
            }
        };
        const fetchMagazyn = async () => {
                    try {
                        const response1 = await fetch(ApiUrl + '/api/magazyn', {
                            headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                        }); // Replace 'your_api_endpoint' with your actual API endpoint
        
                        const storageData = await response1.json();
                        const storageOptions = [];
                        for(let storage of storageData){
                            storageOptions.push(<option value={storage._id} key={storage._id}>{storage.name}</option>)
                            //mapOfStorages.set(storage._id, {name: storage.name, shortcut: storage.shortcut});
                        }
                        setMagazyny(storageOptions);

                    } catch (error) {
                        console.error('Error fetching magazyn:', error);
                        setErrorMsg("Error fetching magazyn: " + error);
                    }
                };

        if (!add)
            fetchPolProduct();
        fetchMagazyn();
    }, [polProductId]);

    const handleInputChange = (e) => {
        setPolProduct({
            ...polProduct,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdatePolProduct = async () => {
        let add = searchParams.get('add');

        try {
            const response = await fetch(ApiUrl + (add ? `/api/polprodukt` : `/api/polprodukt/${polProductId}`), {
                method: add ? 'POST' : 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(polProduct),
            });

            if (response.ok) {
                console.log('Polproduct updated successfully');
                navigate("/polproducts");
            } else {
                console.error('Failed to update polProduct');
                setErrorMsg('Failed to update polProduct');
            }
        } catch (error) {
            console.error('Error updating polProduct:', error);
            setErrorMsg("Error updating polProduct: " + error);
        }
    };

    return (
        <div>
            <h2>Polproduct Data</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formPolProductName">
                    <Form.Label>Pol product Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter polproduct name"
                        name="name"
                        value={polProduct.name}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductMagazyn">
                    <Form.Label>Pol product magazyn</Form.Label>
                    <Form.Select
                        name="magazyn"
                        value={polProduct.magazyn}
                        onChange={handleInputChange}
                    >
                        {magazyny}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductUnitMain">
                    <Form.Label>Pol product main unit</Form.Label>
                    <Form.Select
                        name="unitMain"
                        value={polProduct.unitMain}
                        onChange={handleInputChange}
                    >
                        <option value="KOSZ">KOSZ</option>
                        <option value="KARTON">KARTON</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductUnitSub">
                    <Form.Label>Pol product sub unit</Form.Label>
                    <Form.Select
                        name="unitSub"
                        value={polProduct.unitSub}
                        onChange={handleInputChange}
                    >
                        <option value="WOREK">WOREK</option>
                        <option value="TUBA">TUBA</option>
                        <option value="RĘKAW">RĘKAW</option>
                        <option value="OPAKOWANIE">OPAKOWANIE</option>
                        <option value="-">-</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductMultiplayerSubToMain">
                    <Form.Label>Product sub to main multiplayer</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter polProduct sub to main multiplayer"
                        name="multiplayerSubToMain"
                        value={polProduct.multiplayerSubToMain}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductMultiplayerUnitToSub">
                    <Form.Label>Product unit to sub multiplayer</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter polProduct unit to sub multiplayer"
                        name="multiplayerUnitToSub"
                        value={polProduct.multiplayerUnitToSub}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPolProductUnit">
                    <Form.Label>Pol product unit</Form.Label>
                    <Form.Select
                        name="unit"
                        value={polProduct.unit}
                        onChange={handleInputChange}
                    >
                        <option value="SZTUKA">SZTUKA</option>
                        <option value="TUBA">TUBA</option>
                        <option value="GR">GR</option>
                        <option value="ML">ML</option>
                        <option value="PLASTER">PLASTER</option>
                    </Form.Select>
                </Form.Group>

                {errorMsg && <p className='text-danger'>{errorMsg}</p>}

                <Button variant="primary" onClick={handleUpdatePolProduct}>
                    Confirm
                </Button>
            </Form>
        </div>
    );
};

export default EditPolProduct;
