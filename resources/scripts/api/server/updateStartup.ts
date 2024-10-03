import http from '@/api/http';

interface UpdateStartupParams {
    startup: string;
    environment: { [key: string]: string };
    egg: number;
    image: string;
    skip_scripts?: boolean;
}

export default async (serverId: number, params: UpdateStartupParams): Promise<void> => {
    await http.patch(`/api/application/servers/${serverId}/startup`, {
        startup: params.startup,
        environment: {
            ...params.environment,
            MC_VERSION: params.environment.MC_VERSION || '',
            BUILD_TYPE: params.environment.BUILD_TYPE || '',
        },
        egg: params.egg,
        image: params.image,
        skip_scripts: params.skip_scripts || true, 
    });
};
