import React, { forwardRef } from 'react';
import { Form } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import './LoginContainer.css'; // Importar el archivo de estilos

type Props = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    title?: string;
};

const CustomLoginForm = forwardRef<HTMLFormElement, Props>(({ title, ...props }, ref) => (
    <div className="container, box">
        <div>
            {title && (
                <div className="title-container">
                    <h2>{title}</h2>
                </div>
            )}
            <FlashMessageRender className="mb-2" />
            <Form {...props} ref={ref}>
                <div className="login-form">
                    <div className="login-image-container">
                        <img src={'/assets/svgs/nomccitop_finallogo.svg'} alt="NomcciTop Logo" className="login-image" />
                    </div>
                    <div className="login-form-content">{props.children}</div>
                </div>
            </Form>
            <p className="login-footer">
                &copy; 2015 - {new Date().getFullYear()}&nbsp;
                <a
                    rel={'noopener nofollow noreferrer'}
                    href={'https://pterodactyl.io'}
                    target={'_blank'}
                >
                    Pterodactyl Software
                </a>
            </p>
        </div>
    </div>
));


export default CustomLoginForm;
