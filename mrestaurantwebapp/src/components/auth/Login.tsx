import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthService from "./AuthorizeService";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

interface FormData {
    username: string;
    password: string;
}

const validationSchema = Yup.object().shape({
    username: Yup.string()
        .required('Username is required')
        .email('Username is not a valid email')
        .min(6, 'Username must be at least 6 characters')
        .max(40, 'Username must not exceed 40 characters'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .max(40, 'Password must not exceed 40 characters'),
});



const Login: React.FC = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (data: FormData) => {
        setMessage("");
        setLoading(true);

        try {
            await AuthService.login(data.username, data.password);

            let returnUrl = getReturnUrlFromQueryParam()
            if (!returnUrl)
                returnUrl = "/";

            navigate(returnUrl);
        } catch (e) {
            setLoading(false);
            setMessage(e.message);
        }
    };

    const getReturnUrlFromQueryParam = () => {
        const params = new URLSearchParams(window.location.search);
        let returnUrl = params.get("returnUrl");
        if (returnUrl && !returnUrl.startsWith(`${window.location.origin}/`)) {
            // This is an extra check to prevent open redirects.
            throw new Error("Invalid return url. The return url needs to have the same origin as the current page.");
        }
        if (returnUrl) {
            returnUrl = returnUrl.replace(`${window.location.origin}`, "");
        }
        return returnUrl;
    }

    return (
        <div className="col-md-12">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                        name="username"
                        type="email"
                        {...register('username')}
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.username?.message}</div>
                </div>

                <div className="form-group mb-3">
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        {...register('password')}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.password?.message}</div>
                </div>

                <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <span>Login</span>
                </button>

                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Login;
