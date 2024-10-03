import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import { ServerContext } from '@/state/server';
import getEggs from '@/api/nests/getMinecraftEggs';
import getStartup from '@/api/server/getStartup';
import updateStartup from '@/api/server/updateStartup';

const MinecraftEggsComboBox = () => {
    const serverData = ServerContext.useStoreState((state) => state.server.data!);
    const [eggs, setEggs] = useState<any[]>([]);
    const [selectedEgg, setSelectedEgg] = useState<number | null>(null);

    useEffect(() => {
        const fetchEggs = async () => {
            try {
                const fetchedEggs = await getEggs();
                setEggs(fetchedEggs);
            } catch (error) {
                console.error('Error fetching eggs:', error);
            }
        };

        const fetchStartup = async () => {
            try {
                const serverUuid = Number(serverData.internalId);
                const startup = await getStartup(serverUuid);
                setSelectedEgg(startup.egg);
            } catch (error) {
                console.error('Error fetching startup:', error);
            }
        };

        fetchEggs();
        fetchStartup();
    }, [serverData]);

    const handleEggSelection = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const eggId = Number(event.target.value);
        try {
            const serverUuid = Number(serverData.internalId);
            const startup = await getStartup(serverUuid);

            // Obtiene las variables del Egg seleccionado
            const eggData = await getEggVariables(eggId);

            const environment = {
                ...startup.environment,
                SERVER_JARFILE: eggData.SERVER_JARFILE || startup.environment.SERVER_JARFILE,
                MC_VERSION: eggData.MC_VERSION || startup.environment.MC_VERSION,
                BUILD_TYPE: eggData.BUILD_TYPE || startup.environment.BUILD_TYPE,
                FORGE_VERSION: eggData.FORGE_VERSION || startup.environment.FORGE_VERSION,
                VANILLA_VERSION: eggData.VANILLA_VERSION || startup.environment.VANILLA_VERSION,
                SPONGE_VERSION: eggData.SPONGE_VERSION || startup.environment.SPONGE_VERSION,
                MINECRAFT_VERSION: eggData.MINECRAFT_VERSION || startup.environment.MINECRAFT_VERSION,
                DL_PATH: eggData.DL_PATH || startup.environment.DL_PATH,
                BUILD_NUMBER: eggData.BUILD_NUMBER || startup.environment.BUILD_NUMBER,
                BUNGEE_VERSION: eggData.BUNGEE_VERSION || startup.environment.BUNGEE_VERSION,
            };

            await updateStartup(serverUuid, {
                egg: eggId,
                environment: environment,
                image: startup.image,
                startup: startup.startup,
            });

            setSelectedEgg(eggId);
        } catch (error) {
            console.error('Error updating startup:', error);
        }
    };

    const getEggVariables = (eggId: number) => {
        switch (eggId) {
            case 1:
                return {
                    SERVER_JARFILE: 'server.jar',
                    MC_VERSION: 'latest',
                    BUILD_TYPE: 'recommended',
                    FORGE_VERSION: '',
                };
            case 2:
                return {
                    SERVER_JARFILE: 'server.jar',
                    VANILLA_VERSION: 'latest',
                };
            case 3:
                return {
                    SPONGE_VERSION: '1.12.2-7.3.0',
                    SERVER_JARFILE: 'server.jar',
                };
            case 4:
                return {
                    MINECRAFT_VERSION: 'latest',
                    SERVER_JARFILE: 'server.jar',
                    DL_PATH: '',
                    BUILD_NUMBER: 'latest',
                };
            case 5:
                return {
                    BUNGEE_VERSION: 'latest',
                    SERVER_JARFILE: 'bungeecord.jar',
                };
            default:
                return {};
        }
    };

    return (
        <div>
            <h3 css={tw`text-lg font-semibold mb-2`}>Cambiar software</h3>
            <select
                css={tw`bg-[#1f2933] text-white p-4 rounded-lg w-full`}
                value={selectedEgg || ''}
                onChange={handleEggSelection}
            >
                <option value="" disabled>Selecciona un software</option>
                {eggs.map((egg) => (
                    <option key={egg.id} value={egg.id}>
                        {egg.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default MinecraftEggsComboBox;
