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
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-camera'
      },
      {
        "id": "Vehículos",
        "title": "Vehículos",
        "type": "item",
        "url": "/chart",
        "classes": "nav-item",
        "icon": "fa-solid fa-car"
      }
      ,
      {
        id: 'Sectores',
        title: 'Sectores',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-map-pin'
      },
      {
        id: 'Zonas',
        title: 'Zonas',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-map-pin'
      },
       {
        id: 'apexchart',
        title: 'Lista Negra',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-alert-octagon'
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
            id: 'Membresías',
            title: 'Membresías',
            type: 'item',
            url: '/memberShipType-index'
          },
          {
            id: 'Tarifas',
            title: 'Tarifas',
            type: 'item',
            url: '/TypeVehicle-index'
          },
          {
            id: 'RegisteredVehicles',
            title: 'Registros de Vehículos',
            type: 'item',
            url: '/RatesType-index'
          },
          {
            id: 'Slots',
            title: 'Espacios',
            type: 'item',
            url: '/ParkingCategory-index'
          },
           {
            id: 'HistoryVehicle',
            title: 'Historial de Vehículos',
            type: 'item',
            url: '/ParkingCategory-index'
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
  // {
  //   id: 'Authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'signup',
  //       title: 'Sign up',
  //       type: 'item',
  //       url: '/register',
  //       icon: 'feather icon-at-sign',
  //       target: true,
  //       breadcrumbs: false
  //     },
  //     {
  //       id: 'signin',
  //       title: 'Sign in',
  //       type: 'item',
  //       url: '/login',
  //       icon: 'feather icon-log-in',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  // {
  //   id: 'forms & tables',
  //   title: 'Forms & Tables',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'forms',
  //       title: 'Basic Forms',
  //       type: 'item',
  //       url: '/forms',
  //       classes: 'nav-item',
  //       icon: 'feather icon-file-text'
  //     },
  //     {
  //       id: 'tables',
  //       title: 'Tables',
  //       type: 'item',
  //       url: '/tables',
  //       classes: 'nav-item',
  //       icon: 'feather icon-server'
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-group',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'feather icon-sidebar'
  //     },
  //     {
  //       id: 'menu-level',
  //       title: 'Menu Levels',
  //       type: 'collapse',
  //       icon: 'feather icon-menu',
  //       children: [
  //         {
  //           id: 'menu-level-2.1',
  //           title: 'Menu Level 2.1',
  //           type: 'item',
  //           url: 'javascript:',
  //           external: true
  //         },
  //         {
  //           id: 'menu-level-2.2',
  //           title: 'Menu Level 2.2',
  //           type: 'collapse',
  //           children: [
  //             {
  //               id: 'menu-level-2.2.1',
  //               title: 'Menu Level 2.2.1',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             },
  //             {
  //               id: 'menu-level-2.2.2',
  //               title: 'Menu Level 2.2.2',
  //               type: 'item',
  //               url: 'javascript:',
  //               external: true
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  // }
];
