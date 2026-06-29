import React from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { FaTrash } from 'react-icons/fa';
import './CommandeForm.module.css';
const QuantiteSelector = ({ quantite, quantiteMax, onAugmenter, onDiminuer, onSupprimer }) => {
    return (
        <InputGroup className="mb-3 quantite-selector">
            <Button variant="outline-secondary" onClick={onDiminuer} disabled={quantite <= 1}>
                <AiOutlineMinus />
            </Button>
            <FormControl value={quantite} readOnly style={{ width: '50px', textAlign: 'center' }} />
            <Button variant="outline-secondary" onClick={onAugmenter} disabled={quantite >= quantiteMax}>
                <AiOutlinePlus />
            </Button>
            <Button variant="outline-danger ms-2" onClick={onSupprimer}>
                <FaTrash />
            </Button>
        </InputGroup>
    );
};

export default QuantiteSelector;
