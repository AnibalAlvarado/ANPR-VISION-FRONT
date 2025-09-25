import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

type TabKey = 'perfil' | 'seguridad' | 'notificaciones' | 'pagos' | 'apariencia';

interface Curso {
  id: number;
  titulo: string;
  subtitulo: string;
  estado: 'completado' | 'iniciado';
  descripcion: string;
  instructor: string;
  nivel: 'Básico' | 'Intermedio' | 'Avanzado';
  horas: number;
  progreso: number;         // 0-100
  beneficios: string[];
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfiguracionComponent implements OnInit {
  activeTab: TabKey = 'perfil';

  perfilForm!: FormGroup;
  passwordForm!: FormGroup;
  notifForm!: FormGroup;
  pagosForm!: FormGroup;
  aparienciaForm!: FormGroup;

  user = {
    nombre: 'Prokhorova Nikol',
    email: 'nikol@example.com',
    telefono: '+278 965 236 25',
    ciudad: 'Bogotá',
    pais: 'Colombia'
  };

  // === Cursos para la timeline ===
  cursos: Curso[] = [
    {
      id: 1,
      titulo: 'UX/UI Design — sitios web',
      subtitulo: '62 lecciones • proyecto',
      estado: 'completado',
      descripcion: 'Diseña interfaces para sitios modernos: arquitectura de información, wireframes, patrones y handoff.',
      instructor: 'Laura Rivas',
      nivel: 'Intermedio',
      horas: 14,
      progreso: 100,
      beneficios: ['Guía de componentes', 'Proyecto final evaluado', 'Acceso a plantillas']
    },
    {
      id: 2,
      titulo: 'UX/UI Design — prototipos',
      subtitulo: 'Figma avanzado',
      estado: 'completado',
      descripcion: 'Prototipado de alta fidelidad en Figma: microinteracciones, variables y flows con usuarios.',
      instructor: 'Jorge León',
      nivel: 'Avanzado',
      horas: 10,
      progreso: 100,
      beneficios: ['Archivo maestro Figma', 'Biblioteca de iconos', 'Buenas prácticas']
    },
    {
      id: 3,
      titulo: 'UX/UI Design — animaciones',
      subtitulo: 'Iniciado: 15/06/2025',
      estado: 'iniciado',
      descripcion: 'Motion para UI: timing, easing y transiciones accesibles. Exportación para desarrollo.',
      instructor: 'María Soto',
      nivel: 'Intermedio',
      horas: 8,
      progreso: 35,
      beneficios: ['Presets de animación', 'Checklist de accesibilidad', 'Casos de uso']
    }
  ];

  selectedCourse: Curso | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.user.nombre, [Validators.required, Validators.minLength(3)]],
      email: [this.user.email, [Validators.required, Validators.email]],
      telefono: [this.user.telefono],
      ciudad: [this.user.ciudad],
      pais: [this.user.pais]
    });

    this.passwordForm = this.fb.group({
      actual: ['', [Validators.required]],
      nueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', [Validators.required]]
    });

    this.notifForm = this.fb.group({
      email: [true],
      sms: [false],
      push: [true],
      resumenSemanal: [true]
    });

    this.pagosForm = this.fb.group({
      metodoPreferido: ['visa'],
      recordatorioPago: [true]
    });

    this.aparienciaForm = this.fb.group({
      tema: ['auto'],
      densa: [false],
      animaciones: [true]
    });
  }

  setTab(tab: TabKey) { this.activeTab = tab; }

  // === Detalle dinámico ===
  selectCourse(curso: Curso) {
    this.selectedCourse = curso;
  }
  closeDetail() {
    this.selectedCourse = null;
  }
  continuar(curso: Curso) {
    console.log('Continuar curso:', curso.titulo);
  }
  verCertificado(curso: Curso) {
    console.log('Ver certificado de:', curso.titulo);
  }

  // Acciones demo existentes
  guardarPerfil() { if (this.perfilForm.invalid) return this.perfilForm.markAllAsTouched(); }
  cambiarPassword() {
    if (this.passwordForm.invalid) return this.passwordForm.markAllAsTouched();
    const { nueva, confirmar } = this.passwordForm.value;
    if (nueva !== confirmar) this.passwordForm.get('confirmar')?.setErrors({ mismatch: true });
  }
  guardarNotificaciones() {}
  guardarPagos() {}
  guardarApariencia() {}
}
