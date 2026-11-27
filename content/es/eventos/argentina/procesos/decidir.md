---
sidebarTitle: Decidir
---

<iframe width="100%" height="515" src="https://www.youtube.com/embed/9cC94zqJmgo?si=Gubp13ohIyhyOgzl" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Ejemplo

> En este punto del proceso, después de revisar los resultados del dia en el barrio y escuchar las tensiones del equipo, estamos cerrando la decisión ahora con **Alicia** y **Roberto**
> 
> Asignaremos un 40% a los organizadores y un 60% a la implementación, con una revisión y ajuste opcional después de cada hito completado.

## Esquema

```json
{
    "facilitating": "<generado-automaticamente>",
    "participating": [
        "@alicia",
        "@roberto"
    ],
    "deciding": {
        "voice": {
            "duration": 0,
            "mime_type": "audio/ogg",
            "file_id": ""
        },
        "decision": "<extraido-automaticamente-del-audio>",
        "context": {
            "summary": "<extraido-automaticamente-del-audio>",
            "dependencies": [],
            "deadline": null
        }
    },
    "timestamp": "<generado-automaticamente>"
}
```

### Explicación de los campos

- **`facilitating`**  
    Participante inferido automáticamente que ocupa el rol de facilitación del espacio de decisión.
    
- **`participating`**  
    Lista de contribuyentes activos presentes en el proceso de toma de decisiones.
    
- **`deciding.voice`**  
    Señal de voz en bruto del momento. Es la fuente principal desde la cual se extrae el significado estructurado.
    
- **`deciding.decision`**  
    Decisión explícita extraída de la nota de voz. Debe ser un compromiso único, claro y accionable, expresado en tiempo presente.
    
- **`deciding.context.summary`**  
    Interpretación comprimida de la situación descrita en el audio: por qué la decisión se toma _ahora_, en este momento del proceso.
    
- **`deciding.context.dependencies`**  
    Lista opcional de condiciones externas requeridas para que la decisión sea válida o ejecutable (por ejemplo: acceso a herramientas, confirmación de presupuesto, alineación de otros equipos).
    
- **`deciding.context.deadline`**  
    Restricción temporal opcional inferida de la voz o expresada explícitamente.
    
- **`timestamp`**  
    Marca de tiempo automática en formato ISO 8601 del momento en que se emitió la señal.