# Skill: Conversion CSS Variables to `colors.js`

## Zweck

Dieses Dokument beschreibt den Prozess, CSS-Variablen (aus `:root` oder Theme-Klassen) in das spezifische JavaScript-Objektformat der `colors.js` zu transformieren. Dies dient der Konsistenz im gesamten Projekt.

## 1. Die Farb-Struktur (Schema)

Jedes Farb-Set (z. B. `dark`, `light`, `dark1`, `light1`) muss exakt die folgenden Keys enthalten. Die Keys werden aus den CSS-Variablen durch Entfernen von Bindestrichen und Umwandlung in Kleinschreibung abgeleitet.

| CSS Variable     | JS Key        | Beschreibung                          |
| :--------------- | :------------ | :------------------------------------ |
| `--bg-dark`      | `bgdark`      | Tiefster Hintergrund (Darkest Layer)  |
| `--bg`           | `bg`          | Haupt-Hintergrund                     |
| `--bg-light`     | `bglight`     | Hellerer Hintergrund (Lightest Layer) |
| `--text`         | `text`        | Haupt-Textfarbe                       |
| `--text-muted`   | `textmuted`   | Deaktivierte oder gedämpfte Textfarbe |
| `--highlight`    | `highlight`   | Akzentfarbe für Hervorhebungen        |
| `--border`       | `border`      | Standard-Rahmenlinie                  |
| `--border-muted` | `bordermuted` | Dezente/Gedämpfte Rahmenlinie         |
| `--primary`      | `primary`     | Primäre Markenfarbe                   |
| `--secondary`    | `secondary`   | Sekundäre Markenfarbe                 |
| `--danger`       | `danger`      | Fehler/Gefahr-Farbe                   |
| `--warning`      | `warning`     | Warn-Farbe                            |
| `--success`      | `success`     | Erfolgs-Farbe                         |
| `--info`         | `info`        | Informations-Farbe                    |

## 2. Umwandlungs-Regeln (Mapping Rules)

1.  **Format-Wahl:** Verwende primär den **HSL-Wert** aus dem CSS (da dieser in der `colors.js` standardmäßig verwendet wird). OKLCH-Werte werden nur als Fallback im CSS benötigt, aber nicht in das JS-Objekt übernommen.
2.  **Naming Convention:**
    - Entferne alle Bindestriche (`-`) aus den Variablennamen.
    - Wandle alle Buchstaben in Kleinschreibung um (`lowercase`).
    - Beispiel: `--bg-dark` $\rightarrow$ `bgdark`.
3.  **String-Format:** Der Wert muss als String im Format `'hsl(H S% L%)'` gespeichert werden.
4.  **Struktur:** Die Datei muss als `export default` ein Objekt zurückgeben, das verschiedene Theme-Objekte (`dark`, `light`, `dark1`, etc.) enthält.

## 3. Beispiel-Template

### Input (CSS)

```css
:root {
  --bg-dark: hsl(244 100% 5%);
  --text: hsl(228 100% 100%);
  /* ... restliche Werte */
}
```

### Output (`colors.js`)

```javascript
export default {
  dark: {
    bgdark: 'hsl(244 100% 5%)',
    text: 'hsl(228 100% 100%)',
    // ... restliche Keys
  },
  // ... weitere Themes (light, dark1, etc.)
};
```

## 4. Checkliste für neue Themes

- [ ] Sind alle 14 Keys vorhanden?
- [ ] Sind alle Keys kleingeschrieben und ohne Bindestriche?
- [ ] Wurden HSL-Werte statt OKLCH-Werte verwendet?
- [ ] Ist das Komma nach dem letzten Key im Objekt entfernt (optional, aber sauber für JS-Objekte)?
- [ ] Ist die Struktur als `export default` definiert?

---

### Tipp für die Verwendung:

Du kannst diese Datei in deinem Projektordner speichern. Wenn du also in ein paar Monaten ein neues Design (z.B. "Midnight Blue") erstellst, kannst du einfach die CSS-Werte kopieren und nach dieser Anleitung "durchschleusen".
