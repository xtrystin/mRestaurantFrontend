import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import { useNavigate } from 'react-router-dom';

const EditPracownicy: React.FC = () => {
    const elementId = useParams().id;
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const [pracownik, setpracownik] = useState({
        fName: '',
        lName: '',
        address: '',
        role: 'Manager',
        login:'',
        email: '',
    });


    useEffect(() => {
        // Fetch pracownik data based on elementId
        const fetchpracownik = async () => {
            try {
                const response = await fetch(ApiUrl + `/api/pracownik/${elementId}`, {
                    headers: new Headers({ 'Authorization': 'Bearer ' + await authService.getJwtToken() })
                });
                const data = await response.json();
                setpracownik(data);
            } catch (error) {
                console.error('Error fetching pracownik:', error);
                setErrorMsg("Error fetching pracownik: " + error);
            }
        };

        fetchpracownik();
    }, [elementId]);

    const handleInputChange = (e) => {
        setpracownik({
            ...pracownik,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdatepracownik = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/pracownik/${elementId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify(pracownik),
            });

            if (response.ok) {
                console.log('pracownik updated successfully');
                navigate("/pracowniks");
            } else {
                console.error('Failed to update pracownik');
                setErrorMsg("Failed to update pracownik");
            }
        } catch (error) {
            console.error('Error updating pracownik:', error);
            setErrorMsg('Error updating pracownik: ' + error);
        }
    };

    return (
        <div>
            <h2>Edit pracownik</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formpracownikfName">
                    <Form.Label>Pracownik first name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter pracownik name"
                        name="fName"
                        value={pracownik.fName}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formpracowniklName">
                    <Form.Label>Pracownik last name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter pracownik name"
                        name="lName"
                        value={pracownik.lName}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formpracownikAddress">
                    <Form.Label>Pracownik address</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter pracownik address"
                        name="location"
                        value={pracownik.address}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formpracownikRole">
                    <Form.Label>Pracownik rola</Form.Label>
                    <Form.Select
                        name="role"
                        value={pracownik.role}
                        onChange={handleInputChange}
                    >
                        <option value="Manager">Manager</option>
                        <option value="Kierownik Restauracji">Kierownik Restauracji</option>
                        <option value="Admin">Admin</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formpracownikLogin">
                    <Form.Label>Pracownik login</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter pracownik name"
                        name="login"
                        value={pracownik.login}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formpracownikEmail">
                    <Form.Label>Pracownik email</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter pracownik name"
                        name="email"
                        value={pracownik.email}
                        onChange={handleInputChange}
                    />
                </Form.Group>

                {errorMsg && <p className='text-danger'>{errorMsg}</p>}

                <Button variant="primary" onClick={handleUpdatepracownik}>
                    Update pracownik
                </Button>
            </Form>
        </div>
    );
};

export default EditPracownicy;
