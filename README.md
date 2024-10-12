[![Logo Image](https://cdn.pterodactyl.io/logos/new/pterodactyl_logo.png)](https://pterodactyl.io)

## Este no es el repositorio oficial de Pterodactyl

Lo puedes encontrar en https://github.com/pterodactyl
Tampoco es un Fork
Es un proyecto que utiliza Pterodactyl cambiando algunos componentes.
Son libres de utilizar los componentes para sus necesidades ademas de estudiar el codigo.

## This is not the official Pterodactyl repository
You can find the official repository at https://github.com/pterodactyl
This is not a fork.
This project uses Pterodactyl with some modified components.
Feel free to use the components for your needs and study the code.

## Instructions for instalation at the end (In spanish)
## Instrucciones para la instalacion al final

# Pterodactyl Panel

Pterodactyl® is a free, open-source game server management panel built with PHP, React, and Go. Designed with security
in mind, Pterodactyl runs all game servers in isolated Docker containers while exposing a beautiful and intuitive
UI to end users.

Stop settling for less. Make game servers a first class citizen on your platform.



![Image](https://cdn.pterodactyl.io/site-assets/pterodactyl_v1_demo.gif)

## Documentation

* [Panel Documentation](https://pterodactyl.io/panel/1.0/getting_started.html)
* [Wings Documentation](https://pterodactyl.io/wings/1.0/installing.html)
* [Community Guides](https://pterodactyl.io/community/about.html)
* Or, get additional help [via Discord](https://discord.gg/pterodactyl)

## Sponsors

I would like to extend my sincere thanks to the following sponsors for helping fund Pterodactyl's development.
[Interested in becoming a sponsor?](https://github.com/sponsors/matthewpi)

| Company                                                      | About                                                                                                                                                                                                                                           |
|--------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [**Aussie Server Hosts**](https://aussieserverhosts.com/)    | No frills Australian Owned and operated High Performance Server hosting for some of the most demanding games serving Australia and New Zealand.                                                                                                 |
| [**BisectHosting**](https://www.bisecthosting.com/)          | BisectHosting provides Minecraft, Valheim and other server hosting services with the highest reliability and lightning fast support since 2012.                                                                                                 |
| [**MineStrator**](https://minestrator.com/)                  | Looking for the most highend French hosting company for your minecraft server? More than 24,000 members on our discord trust us. Give us a try!                                                                                                 |
| [**HostEZ**](https://hostez.io)                              | US & EU Rust & Minecraft Hosting. DDoS Protected bare metal, VPS and colocation with low latency, high uptime and maximum availability. EZ!                                                                                                     |
| [**Blueprint**](https://blueprint.zip/?pterodactyl=true)     | Create and install Pterodactyl addons and themes with the growing Blueprint framework - the package-manager for Pterodactyl. Use multiple modifications at once without worrying about conflicts and make use of the large extension ecosystem. |
| [**indifferent broccoli**](https://indifferentbroccoli.com/) | indifferent broccoli is a game server hosting and rental company. With us, you get top-notch computer power for your gaming sessions. We destroy lag, latency, and complexity--letting you focus on the fun stuff.                              |

## Panel NomcciTop

El panel NomcciTop no es una plantilla ni un proyecto de componentes individuales.
Tiene las siguientes funciones junto con la explicacion de su instalacion:

## Nuevo Login y Registro.

![Image](https://i.imgur.com/m6Z9EmY.png)

## Instalacion Login y Registro.

* Es necesario el uso de toda la carpeta Resources >  Scripts > Components > Auth

* La configuracion de colores y pagina puede hacerse atravez de LoginContainer.css

* Para cambio de imagen de logo reemplazar ```<img src={'/assets/svgs/NomcciLogo2SF.svg'} alt="NomcciTop Logo" className="login-image" />``` especificamente ```'/assets/svgs/NomcciLogo2SF.svg'``` con el SVG de tu logo.
* La carpeta en donde se encuentra el logo esta en Public > Assets > svgs

## Manejo de versiones

* El manejo de versiones no fue creado por el equipo. Es un addon comprable e instalable, no se daran detalles de su instalacion pero es necesario una instalacion nueva de wings para su uso. Se recomienda encarecidamente comprarlo para el manejo completo del panel, de otra forma, solo instalar los componentes ofrecidos en este repositorio ya que sin el wings ofrecido por el usuario NO FUNCIONARA este panel.
Excepto por la version custom de Forge, este fue creado por el equipo.
* Para la instalacion de forge custom en el apartado versions son necesarios los siguientes archivos de Resources > Scripts > Api
UpdateStartup - UpdateStartupVariable - SetSelectedDockerImage - GetStartup - ReinstallServer
* en Resources > Scripts > Components > Server > Versions son necesarios los siguientes archivos
CustomVersion - VersionInput
* **Lo siguiente se hace en el archivo VersionsContainer.tsx**
* Se importa el Api para getStartup ```import getStartup, { ServerStartup } from '@/api/server/getStartup';```
* En VersionsContainer con ```const [startupData, setStartupData] = useState<ServerStartup | null>(null);``` se obtienen los datos del servidor, para en caso de ser forge mostrar el contenedor para cambio de version y debajo de este el siguiente codigo para obtener los datos.

```
  useEffect(() => {
        const fetchStartup = async () => {
            try {
                if (serverData?.internalId) { 
                    const serverUuid = Number(serverData.internalId);
                    const startup = await getStartup(serverUuid);
                    console.log('Startup Data:', startup);
                    console.log('Egg:', startup.egg);
                    setStartupData(startup);
                } else {
                    console.error('No serverData or internalId found.');
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchStartup();
    }, [uuid]);
```
![Image](https://i.imgur.com/P7LBQv7.png)
* Considerando que forge es el egg de id 1 se utilizara el siguiente codigo para mostrar el contenedor en el return
```
  {
    startupData?.egg === 1 && 
        <TitledGreyBox title="Forge Custom - NomcciTop">
        <CustomVersions />
        <p css={tw`text-center text-sm text-neutral-400 pt-4 pb-4`}>
            Utiliza una versión de{' '}
            <a
                href="https://files.minecraftforge.net/net/minecraftforge/forge/"
                target="_blank"
                rel="noopener noreferrer"
                css={tw`text-blue-500 hover:underline`}
            >
                https://files.minecraftforge.net/net/minecraftforge/forge/
            </a>{' '}
            con un formato sin espacios. Ejemplo: "1.20.6-50.1.14"
        </p>
    </TitledGreyBox>
}
```
![Image](https://i.imgur.com/0IoFxXu.png)

* En Resources > Scripts > Routers > routes.ts importar el componente import VersionsContainer from '@/components/server/versions/VersionsContainer';
* Añadir lo siguiente al final de la lista de Server
```
{
    path: '/versions',
    permission: 'versions.*',
    name: 'Versions',
    component: VersionsContainer,
}
```
![Image](https://i.imgur.com/6DpwYJI.png)

## Reinstalacion animada

* Reemplaza tu Resources > Scripts > Components > Elements > ScreenBlock.tsx con el de este repositorio.
* Reemplaza tu Resources > Scripts > Components > Server > ConflictStateRenderer.tsx con el de este repositorio.
* En el archivo anterior reemplaza ```import ServerInstallSvg from '@/assets/images/nomccitop_logo.svg';``` con la imagen de tu logo, especificamente reemplaza ```'@/assets/images/nomccitop_logo.svg'```
* Esta vez el logo se encuentra en  Resources > Scripts > Assets > Images

## Cambio de Egg en Configuracion 

* Son necesarios los siguientes archivos de Resources > Scripts > Api
* UpdateStartup - UpdateStartupVariable - SetSelectedDockerImage - GetStartup - ReinstallServer

* Es necesario el archivo Resources > Scripts > Components > Server > Settings > EggSelectorBox.tsx
* Para añadirlo solo pon en tu SettingsContainer.tsx el componente, como por ejemplo conservando el estilo pterodactyl
```
<TitledGreyBox title={'Software changing'} css={tw`mb-6 md:mb-10`}>
    <EggSelectorBox></EggSelectorBox>
</TitledGreyBox>
```

![Image](https://i.imgur.com/6V84Iew.png)

## License

Pterodactyl® Copyright © 2015 - 2022 Dane Everitt and contributors.

Code released under the [MIT License](./LICENSE.md).
