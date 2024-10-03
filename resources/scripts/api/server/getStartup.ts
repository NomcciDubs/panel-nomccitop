import http from '@/api/http';

export interface ServerStartup {
    id: number;
    startup: string;
    egg: number;
    image: string;
    skipScripts: boolean;
    environment: Record<string, string>;
}

export const rawDataToServerStartup = (data: any): ServerStartup => ({
    id: data.attributes.id,
    startup: data.attributes.container.startup_command,
    egg: data.attributes.egg,
    image: data.attributes.container.image,
    skipScripts: data.attributes.container.environment['skip_scripts'] === 'true', 
    environment: {
        ...data.attributes.container.environment,
        MC_VERSION: data.attributes.container.environment['MC_VERSION'] || '',
        BUILD_TYPE: data.attributes.container.environment['BUILD_TYPE'] || '',
    },
});

export default async (serverId: number): Promise<ServerStartup> => {
    const { data } = await http.get(`/api/application/servers/${serverId}`);
    return rawDataToServerStartup(data);
};
