import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import logo from '../images/logo.png';
import stock1 from '../composants/img/stock.jpeg';
import stock2 from '../composants/img/stock2.jpeg';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState(stock2);

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundImage(currentImage => currentImage === stock1 ? stock2 : stock1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await login(email, password);
            navigate('/tableaudebord');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        }
    };

    return (
        <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="login-overlay" />
            <div className="login-card form-container">
                <div className="login-brand">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="login-title-row">
                    <FaShieldAlt className="login-icon" />
                    <div>
                        <h2>Connexion</h2>
                        <p>Accédez à votre espace de gestion</p>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    {error && <div className="login-error">{error}</div>}
                    <div className="login-input-group">
                        <FaUser className="login-input-icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            maxLength="45"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-input-group">
                        <FaLock className="login-input-icon" />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            required
                            maxLength="40"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Connexion</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
