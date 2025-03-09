import { TodoItem } from './todoItem.js';
import { TodoCollection } from './todoCollection.js';

document.addEventListener('DOMContentLoaded', function() {
    const todoCollection = new TodoCollection("Usuario");

    function actualizarListaTareas() {
        const listaTareas = document.getElementById('tareas');
        const listaTareasCompletadas = document.getElementById('completadas');

        listaTareas.innerHTML = '';
        listaTareasCompletadas.innerHTML = '';

        const tareasPendientes = todoCollection.getTodoItems(false);
        const tareasCompletadas = todoCollection.getTodoItems(true).filter(task => task.complete);

        // Mostrar tareas pendientes
        tareasPendientes.forEach(task => {
            const elementoTarea = document.createElement('div');
            elementoTarea.className = 'task-item';
            elementoTarea.innerHTML = `
                <span><strong>Tarea #${task.id}:</strong> ${task.task}</span>
                <button onclick="marcarTareaCompleta(${task.id})">✓</button>
            `;
            listaTareas.appendChild(elementoTarea);
        });

        // Mostrar tareas completadas SIN botón de eliminar individual
        tareasCompletadas.forEach(task => {
            const elementoTarea = document.createElement('div');
            elementoTarea.className = 'task-item completed';
            elementoTarea.innerHTML = `
                <span><strong>Tarea #${task.id}:</strong> ${task.task} (Completada)</span>
            `;
            listaTareasCompletadas.appendChild(elementoTarea);
        });
    }

    window.marcarTareaCompleta = function(idTarea) {
        todoCollection.markComplete(idTarea, true);
        actualizarListaTareas();
    };

    document.getElementById('formularioAgregarTarea').addEventListener('submit', function(event) {
        event.preventDefault();
        const nombreTarea = document.getElementById('nombreTarea').value;
        if (nombreTarea) {
            const nuevoId = todoCollection.addTodo(nombreTarea);
            actualizarListaTareas();
            document.getElementById('formularioAgregarTarea').reset();
            bootstrap.Modal.getInstance(document.getElementById('modalAgregarTarea')).hide();
        } else {
            alert('Por favor, ingresa un nombre para la tarea.');
        }
    });

    document.getElementById('botonCompletarTodo').addEventListener('click', function() {
        const tareasPendientes = todoCollection.getTodoItems(false);
        if (tareasPendientes.length > 0) {
            tareasPendientes.forEach(task => {
                todoCollection.markComplete(task.id, true);
            });
            actualizarListaTareas();
        } else {
            alert('No hay tareas pendientes para marcar como completadas.');
        }
    });

    document.getElementById('botonEliminarTodo').addEventListener('click', function() {
        const tareasCompletadas = todoCollection.getTodoItems(true);
        if (tareasCompletadas.length > 0) {
            tareasCompletadas.forEach(task => {
                todoCollection.removeComplete(task.id);
            });
            actualizarListaTareas();
        } else {
            alert('No hay tareas completadas para eliminar.');
        }
    });

    actualizarListaTareas();
});
