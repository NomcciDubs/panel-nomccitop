import http from '@/api/http';

interface EggAttributes {
    id: number;
    uuid: string;
    name: string;
    description: string;
    docker_image: string;
    startup: string;
}

interface Egg {
    object: string;
    attributes: EggAttributes;
}

interface EggList {
    object: string;
    data: Egg[];
}

// La respuesta de la API tiene una estructura diferente, así que modificamos la interfaz.
interface NestResponse {
    object: string;
    data: Egg[];
}

export default async (): Promise<EggAttributes[]> => {
    const { data } = await http.get<NestResponse>('/api/application/nests/1/eggs', {
        params: {
            include: 'eggs',
        },
    });

    // Accede directamente a los datos en el campo `data` y mapea los atributos de cada egg.
    return data.data.map((egg: Egg) => egg.attributes);
};
