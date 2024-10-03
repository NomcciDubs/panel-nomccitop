import React from 'react';
import { ServerContext } from '@/state/server';
import ScreenBlock from '@/components/elements/ScreenBlock';
import ServerInstallSvg from '@/assets/images/nomccitop_logo.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';

export default () => {
    const status = ServerContext.useStoreState((state) => state.server.data?.status || null);
    const isTransferring = ServerContext.useStoreState((state) => state.server.data?.isTransferring || false);
    const isNodeUnderMaintenance = ServerContext.useStoreState(
        (state) => state.server.data?.isNodeUnderMaintenance || false
    );

    const svgAnimation = {
        animation: 'deform 2s infinite ease-in-out',
    };

    const keyframes = `
        @keyframes deform {
            0% {
                transform: scale(1);
            }
            25% {
                transform: scale(1.1, 0.9);
            }
            50% {
                transform: scale(0.9, 1.1);
            }
            75% {
                transform: scale(1.05, 0.95);
            }
            100% {
                transform: scale(1);
            }
        }
    `;

    return (
        <>
            <style>{keyframes}</style>
            {status === 'installing' || status === 'install_failed' || status === 'reinstall_failed' ? (
                <ScreenBlock
                    title={'Instalando servidor'}
                    image={<img src={ServerInstallSvg} style={svgAnimation} alt="Instalando servidor..." />}
                    message={'Siéntate y relájate, estamos preparando tu servidor.'}
                />
            ) : status === 'suspended' ? (
                <ScreenBlock
                    title={'Server Suspended'}
                    image={ServerErrorSvg}
                    message={'Este servidor está suspendido y no puede ser accedido.'}
                />
            ) : isNodeUnderMaintenance ? (
                <ScreenBlock
                    title={'Node under Maintenance'}
                    image={ServerErrorSvg}
                    message={'El nodo de este servidor está actualmente en mantenimiento.'}
                />
            ) : (
                <ScreenBlock
                    title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
                    image={ServerRestoreSvg}
                    message={
                        isTransferring
                            ? 'Tu servidor está siendo transferido a un nuevo nodo, por favor vuelve más tarde.'
                            : 'Tu servidor está siendo restaurado desde un respaldo, por favor vuelve en unos minutos.'
                    }
                />
            )}
        </>
    );
};
