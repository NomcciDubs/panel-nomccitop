import React, { useEffect, useRef, useState } from 'react';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Link, RouteComponentProps } from 'react-router-dom';
import http, { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import { Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Reaptcha from 'reaptcha';
import useFlash from '@/plugins/useFlash';
import './LoginContainer.css';

interface Values {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
}

const RegisterContainer = ({ history }: RouteComponentProps) =>{
    const ref = useRef<Reaptcha>(null);
    const [ token, setToken ] = useState('');

    const { clearFlashes, addFlash } = useFlash();
    const { enabled: recaptchaEnabled, siteKey } = useStoreState(state => state.settings.data!.recaptcha);

    useEffect(() => {
        clearFlashes();
    }, []);

    const onSubmit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
        clearFlashes();

        // If there is no token in the state yet, request the token and then abort this submit request
        // since it will be re-submitted when the recaptcha data is returned by the component.
        if (recaptchaEnabled && !token) {
            ref.current!.execute().catch(error => {
                console.error('Error.recaptcha:' + error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
            return;
        }

        http.get('/sanctum/csrf-cookie')
            .then(() => http.post('/auth/register', { ...values }))
            .then(response => {
                /**
                 * DEBUG
                 */
                // console.log(response.data);

                resetForm();
                addFlash({ type: 'success', title: 'Success', message: response.data });
            }).catch(error => {
                /**
                 * DEBUG
                 */
                // console.log(error.response.data);

                setToken('');
                if (ref.current) ref.current.reset();

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <div css={tw`h-screen w-full flex justify-center items-center`}>
            <Formik
                onSubmit={onSubmit}
                initialValues={{ firstname: '', lastname: '', username: '', email: '' }}
                validationSchema={object().shape({
                    firstname: string()
                        .required('Debes ingresar un nombre.')
                        .min(2, 'El nombre es muy corto')
                        .max(20, 'El nombre es demasiado largo'),
                    lastname: string()
                        .required('Debes ingresar un apellido.')
                        .min(2, 'El apellido es muy corto')
                        .max(20, 'El apellido es demasiado largo'),
                    username: string()
                        .required('Ingresa un nombre de usuario.')
                        .min(3, 'El nombre de usuario es muy corto')
                        .max(24, 'El nombre de usuario es muy largo'),
                    email: string()
                        .required('Porfavor ingresa un email.')
                        .email('El email es invalido'),
                })}
            >
                {({ isSubmitting, setSubmitting, submitForm }) => (
                    <LoginFormContainer title={'Registro'} css={tw`w-full flex text-white`}>
                        <div className="form-container">
                            <h2 className="form-title">Registrarse</h2>

                            <label htmlFor="firstname">Nombre:</label>
                            <Field
                                light
                                type={'text'}
                                id="firstname"
                                name={'firstname'}
                                disabled={isSubmitting}
                            />

                            <label htmlFor="lastname">Apellido:</label>
                            <Field
                                light
                                type={'text'}
                                id="lastname"
                                name={'lastname'}
                                disabled={isSubmitting}
                            />

                            <label htmlFor="username">Nombre de usuario:</label>
                            <Field
                                light
                                type={'text'}
                                id="username"
                                name={'username'}
                                disabled={isSubmitting}
                            />

                            <label htmlFor="email">Email:</label>
                            <Field
                                light
                                type={'email'}
                                id="email"
                                name={'email'}
                                disabled={isSubmitting}
                            />

                            <div className="button-container mt-6 text-white">
                                <Button type={'submit'} size={'xlarge'} isLoading={isSubmitting} disabled={isSubmitting}>
                                    Registrarse
                                </Button>
                            </div>

                            {recaptchaEnabled && (
                                <Reaptcha
                                    ref={ref}
                                    size="invisible"
                                    sitekey={siteKey || '_invalid_key'}
                                    onVerify={response => {
                                        setToken(response);
                                        submitForm();
                                    }}
                                    onExpire={() => {
                                        setSubmitting(false);
                                        setToken('');
                                    }}
                                />
                            )}
                            <div css={tw`mt-6 text-center`}>
                                <Link
                                    to={'/auth/login'}
                                    css={tw`text-xs text-neutral-500 tracking-wide uppercase no-underline hover:text-neutral-700`}
                                >
                                    Ya tengo una cuenta
                                </Link>
                            </div>
                        </div>
                    </LoginFormContainer>
                )}
            </Formik>
        </div>
    );
};
export default RegisterContainer;