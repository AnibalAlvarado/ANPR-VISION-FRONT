export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },
   {
    id: 'monitoreo',
    title: 'Monitoreo y control de Acceso',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Cámaras',
        title: 'Cámaras',
        type: 'item',
        url: '/Cámaras-index',
        classes: 'nav-item',
        icon: 'feather icon-camera'
      },
      {
        "id": "Vehículos",
        "title": "Vehículos",
        "type": "item",
        "url": "/Vehículos",
        "classes": "nav-item",
        "icon": "feather icon-map-pin"
      }
      ,

      {
        id: 'Zonas',
        title: 'Zonas',
        type: 'item',
        url: '/Zones-index',
        classes: 'nav-item',
        icon: 'feather icon-map-pin'
      },

    ]
  },


      {
    id: 'ui-component',
    title: 'Módulo Operacional',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Operacional',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'Memberships',
            title: 'Membresías',
            type: 'item',
            url: '/Memberships-index'
          },
          {
            id: 'Rates',
            title: 'Tarifas',
            type: 'item',
            url: '/Rates-index'
          },
          {
            id: 'RegisteredVehicles',
            title: 'Registros de Vehículos',
            type: 'item',
            url: '/RegisteredVehicles-index'
          },

           {
            id: 'HistoryVehicle',
            title: 'Historial de Vehículos',
            type: 'item',
            url: '/HistoryVehicle-index'
          },


        ]
      }
    ]
  },
    {
    id: 'ui-component',
    title: 'Módulo de Parametros',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Parametros',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'MembershipsType',
            title: 'Tipo de Membresías',
            type: 'item',
            url: '/memberShipType-index'
          },
          {
            id: 'TypeVehicle',
            title: 'Tipo de Vehículos',
            type: 'item',
            url: '/TypeVehicle-index'
          },
          {
            id: 'TypeRates',
            title: 'Tipo de Tarifas',
            type: 'item',
            url: '/RatesType-index'
          },
          {
            id: 'CategoryParking',
            title: 'Categorías del Parqueadero',
            type: 'item',
            url: '/ParkingCategory-index'
          },
            {
            id: 'Zones',
            title: 'Zonas',
            type: 'item',
            url: '/Zones-index'
          },
             {
            id: 'Sectors',
            title: 'Sectores',
            type: 'item',
            url: '/Sectors-index'
          },
          {
            id: 'Slots',
            title: 'Espacios',
            type: 'item',
            url: '/Slots-index'
          },

        ]
      }
    ]
  },

  {
    id: 'ui-component',
    title: 'Módulo de Seguridad',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Seguridad',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'Roles',
            title: 'Roles',
            type: 'item',
            url: '/role-index'
          },
          {
            id: 'Formularios',
            title: 'Formularios',
            type: 'item',
            url: '/form-index'
          },
          {
            id: 'Permisos',
            title: 'Permisos',
            type: 'item',
            url: '/permission-index'
          },
          {
            id: 'Módulos',
            title: 'Módulos',
            type: 'item',
            url: '/module-index'
          },
           {
            id: 'FormsModule',
            title: 'Formularios por Modulos',
            type: 'item',
            url: '/form-module-index'
          },
             {
            id: 'RolFormPermission',
            title: 'Permisos por Roles y Formularios',
            type: 'item',
            url: '/rolFormPermission-index'
          },
          {
            id: 'Usuarios',
            title: 'Usuarios',
            type: 'item',
            url: '/user-index'
          },
          {
            id: 'Personas',
            title: 'Personas',
            type: 'item',
            url: '/persons-index'
          },
             {
            id: 'BackList',
            title: 'Lista Negra',
            type: 'item',
            url: '/BackList-index'
          },

        ]
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'Configuración y Soporte',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'Configuración',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-settings'
      },
      {
        id: 'apexchart',
        title: 'Ayuda',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-help-circle'
      },

      {
        id: 'apexchart',
        title: 'Cerrar sesión',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-log-out'
      },

    ]
  },

];
