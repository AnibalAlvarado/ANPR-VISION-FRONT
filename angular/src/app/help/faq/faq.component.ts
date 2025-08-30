import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-faq',
  standalone: true,
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FaqComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  searchQuery = '';

  faqs = [
    // 🔹 Inicio de sesión
    { question: '¿Cómo puedo recuperar mi contraseña?', answer: 'Ve a la sección de configuración y selecciona "Recuperar contraseña".', icon: 'lock_open', expanded: false },
    { question: '¿Por qué no puedo iniciar sesión?', answer: 'Revisa que tus credenciales sean correctas y que tu cuenta esté activa.', icon: 'login', expanded: false },
    { question: '¿Puedo cambiar mi correo asociado?', answer: 'Sí, en la sección de "Perfil" puedes actualizarlo fácilmente.', icon: 'alternate_email', expanded: false },

    // 🔹 Reportes
    { question: '¿Dónde encuentro los reportes?', answer: 'En el menú lateral, selecciona "Reportes".', icon: 'analytics', expanded: false },
    { question: '¿Puedo exportar reportes a Excel?', answer: 'Sí, en la parte superior derecha de cada reporte encontrarás la opción "Exportar".', icon: 'file_download', expanded: false },
    { question: '¿Cómo filtro los reportes?', answer: 'Utiliza los filtros avanzados que encontrarás sobre la tabla de datos.', icon: 'filter_list', expanded: false },

    // 🔹 Soporte y configuración
    { question: '¿Cómo contacto con soporte?', answer: 'Puedes ir a la sección de "Contactar Soporte" dentro de este módulo.', icon: 'support_agent', expanded: false },
    { question: '¿Dónde puedo ver la documentación?', answer: 'Ve a la sección "Documentación" en el menú principal.', icon: 'library_books', expanded: false },
    { question: '¿Puedo personalizar la apariencia del dashboard?', answer: 'Sí, en la sección de configuración puedes ajustar los colores y el layout.', icon: 'palette', expanded: false },

    // 🔹 Instalación y actualizaciones
    { question: '¿Cómo instalo ANPR Vision?', answer: 'Descarga el instalador desde nuestra sección de Documentación y sigue los pasos.', icon: 'cloud_download', expanded: false },
    { question: '¿Cómo actualizo el sistema?', answer: 'En Configuración → Actualizaciones, haz clic en "Buscar actualizaciones".', icon: 'update', expanded: false },
    { question: '¿Qué hago si la instalación falla?', answer: 'Verifica los requisitos mínimos y asegúrate de que no haya conflictos con otros programas.', icon: 'error', expanded: false },

    // 🔹 Seguridad
    { question: '¿Mi información está segura?', answer: 'Sí, utilizamos cifrado AES de 256 bits para proteger tus datos.', icon: 'security', expanded: false },
    { question: '¿Puedo restringir el acceso a ciertos usuarios?', answer: 'Sí, en la sección de Roles y Permisos puedes configurar esto.', icon: 'admin_panel_settings', expanded: false },
    { question: '¿Cómo habilito la verificación en dos pasos?', answer: 'Entra en Configuración → Seguridad y activa la verificación en dos pasos.', icon: 'verified_user', expanded: false }
  ];

  /** Filtra FAQs según la búsqueda */
  get filteredFaqs() {
    return this.faqs.filter(faq =>
      faq.question.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  /** Resalta texto buscado */
  highlightSearch(text: string): string {
    if (!this.searchQuery) return text;
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }

  /** Limpiar búsqueda */
  clearSearch() {
    this.searchQuery = '';
  }

  /** Expandir todo */
  expandAll() {
    this.faqs.forEach(faq => faq.expanded = true);
  }

  /** Colapsar todo */
  collapseAll() {
    this.faqs.forEach(faq => faq.expanded = false);
  }
}
