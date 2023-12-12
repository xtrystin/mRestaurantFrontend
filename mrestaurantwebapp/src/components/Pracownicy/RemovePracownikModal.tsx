import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ApiUrl } from '../../Consts.tsx';
import authService from '../auth/AuthorizeService.tsx';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";

const RemovePracownikModal = ({ isVisible, setVisible, cell, setCell, name, id, ...args}) => {
    const [errorMsg, setErrorMsg] = useState("")

    const handleRemove = async () => {
        try {
            const response = await fetch(ApiUrl + `/api/pracownik/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + await authService.getJwtToken()
                },
                body: JSON.stringify({ "pracownikId": id }),
            });

            if (response.ok) {
                console.log('Pracownik updated successfully');
                cell.getRow().delete();
                setErrorMsg("");
                setVisible(false);
            } else {
                console.error('Failed to update Pracownik');
                setErrorMsg("Failed to update Pracownik")
            }
        } catch (error) {
            console.error('Error updating Pracownik:', error);
            setErrorMsg(`Error updating Pracownik: ${error}`)
        }
    };
    
    return (
      <Modal isOpen={isVisible} toggle={()=>setVisible(!isVisible)} onClosed={()=>setErrorMsg("")} {...args}>
        <ModalHeader toggle={()=>setVisible(!isVisible)}>Czy na pewno chcesz usunąć pracownika?</ModalHeader>
        <ModalBody>
          <p className="fs-5">Pracownik o nazwie: {name} zostanie usunięty.</p>
          <p className="fs-6">Czy jesteś tego pewny?</p>
          {errorMsg && <p className='text-danger'>{errorMsg}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={()=>handleRemove()}>
            Usuń
          </Button>{' '}
          <Button color="secondary" onClick={()=>setVisible(false)}>
            Anuluj
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

export default RemovePracownikModal;
