import React, { useState } from 'react';
import updateStartupVariable from '@/api/server/updateStartupVariable';
import reinstallServer from '@/api/server/reinstallServer';
import { ServerContext } from '@/state/server';
import { Dialog } from '@/components/elements/dialog';
import { Button } from '@/components/elements/button/index';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import tw from 'twin.macro';

const VersionInput = () => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [forgeVersion, setForgeVersion] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const { addFlash, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    // Expresión regular para validar versiones de Forge
    const isValidVersion = (version: string) => {
        const versionPattern = /^(latest|\d+\.\d+\.\d+-\d+\.\d+\.\d+|\d+\.\d+\.\d+|\d+\.\d+\.\d+-\d+\.\d+\.\d+)$/;
        return versionPattern.test(version);
    };
    
    const handleInstall = async () => {
        if (!forgeVersion) {
            setError('Por favor, ingresa una versión de Forge.');
            return;
        }

        if (!isValidVersion(forgeVersion)) {
            setError('La versión de Forge ingresada no es válida. Por favor, ingresa una versión en el formato correcto.');
            return;
        }

        if (!uuid) {
            setError('No se pudo obtener el UUID del servidor.');
            return;
        }

        setError('');
        setIsUpdating(true);

        try {
            await updateStartupVariable(uuid, 'FORGE_VERSION', forgeVersion);
            setModalVisible(true);
        } catch (error) {
            console.error('Error al actualizar la versión de Forge:', error);
            setError('Ocurrió un error al actualizar la versión de Forge.');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReinstall = () => {
        clearFlashes('settings');
        reinstallServer(uuid)
            .then(() => {
                addFlash({
                    key: 'settings',
                    type: 'success',
                    message: 'El servidor ha comenzado el proceso de reinstalación.',
                });
            })
            .catch((error) => {
                console.error('Error al reinstalar el servidor:', error);
                addFlash({ key: 'settings', type: 'error', message: httpErrorToHuman(error) });
            })
            .finally(() => setModalVisible(false));
    };

    return (
        <div>
            <div style={styles.inputGroup}>
                <input
                    type="text"
                    placeholder='Escribe "latest" para la ultima version de forge'
                    style={styles.input}
                    value={forgeVersion}
                    onChange={(e) => setForgeVersion(e.target.value)}
                />
                <button
                    style={styles.button}
                    onClick={handleInstall}
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Actualizando...' : 'Instalar'}
                </button>
            </div>
            {error && (
                <div style={styles.errorContainer}>
                    <p style={styles.errorText}>{error}</p>
                </div>
            )}
            <Dialog.Confirm
                open={modalVisible}
                title={'Confirma la instalación de archivos'}
                confirm={'Sí, cambiar la versión'}
                onClose={() => setModalVisible(false)}
                onConfirmed={handleReinstall}
            >
                <p>
                    Tu servidor se detendrá y se modificarán algunos archivos importantes relacionados con Forge.
                    <br />
                    <strong>
                        Asegúrate de tener una copia de seguridad antes de proceder, ya que podrías perder datos importantes.
                    </strong>
                </p>
            </Dialog.Confirm>
        </div>
    );
};

const styles = {
    inputGroup: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '15px',
        width: '90%',
        fontSize: '20px',
    },
    input: {
        flexGrow: 4,
        fontSize: '13px',
        marginRight: '10px',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        color: '#3a3a3a',
    },
    button: {
        padding: '8px 16px',
        borderRadius: '5px',
        backgroundColor: '#4CAF50',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
    errorContainer: {
        backgroundColor: '#fff',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        padding: '10px',
        marginTop: '10px',
    },
    errorText: {
        color: 'red',
        margin: 0,
    },
};

export default VersionInput;
