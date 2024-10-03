import React, { useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import login from '@/api/auth/login';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import tw from 'twin.macro';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import CustomLoginForm from '@/components/auth/LoginFormContainer'; // Importamos el componente que creamos
import './LoginContainer.css'; // Estilos adicionales

interface Values {
    username: string;
    password: string;
}

const LoginContainer = ({ history }: RouteComponentProps) => {
    const ref = useRef<Reaptcha>(null);
    const [token, setToken] = useState('');

    const { clearFlashes, clearAndAddHttpError } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState((state) => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, [clearFlashes]);

    const onSubmit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();

        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch((error) => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
            return;
        }

        login({
            username: values.username,
            password: values.password,
            recaptchaData: token
        })
            .then((response) => {
                if (response.complete) {
                    window.location.href = response.intended || '/'; // Usar href aquí
                    return;
                }
                history.replace('/auth/login/checkpoint', { token: response.confirmationToken });
            })
            .catch((error) => {
                console.error(error);
                setToken('');
                if (ref.current) ref.current.reset();
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    };

    return (
        <div css={tw`flex justify-center items-center h-screen`}>
            <Formik
                onSubmit={onSubmit}
                initialValues={{ username: '', password: '' }}
                validationSchema={object().shape({
                    username: string().required('Ingresa un nombre de usuario porfavor'),
                    password: string().required('Ingresa una contraseña porfavor.'),
                })}
            >
                {({ isSubmitting, submitForm }) => (
                    <div className="form-container-wrapper">
                        <CustomLoginForm title="Login">
                            <div className="form-container">
                                <h2 className="form-title">Iniciar Sesión</h2>
                                <label htmlFor="username">Nombre de usuario o correo electrónico:</label>
                                <Field type="text" id="username" name="username" disabled={isSubmitting} />
                                <label htmlFor="password">Contraseña:</label>
                                <Field type="password" id="password" name="password" disabled={isSubmitting} />
                                <div className="button-container">
                                    <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                                        Login
                                    </Button>
                                </div>
                                {recaptchaEnabled && (
                                    <Reaptcha
                                        ref={ref}
                                        size="invisible"
                                        sitekey={siteKey || '_invalid_key'}
                                        onVerify={(response) => {
                                            setToken(response);
                                            submitForm();
                                        }}
                                        onExpire={() => setToken('')}
                                    />
                                )}
                                <p className="register-link" style={{ textDecoration: 'underline' }} onClick={() => history.push('/auth/register')}>
                                    No tengo cuenta
                                </p>
                                <div className="forgot-password" style={{ textDecoration: 'underline' }}>
                                    <Link to="/auth/password">¿Olvidaste tu contraseña?</Link>
                                </div>
                            </div>
                        </CustomLoginForm>
                    </div>
                )}
            </Formik>
        </div>
    );    
    
};

export default LoginContainer;
