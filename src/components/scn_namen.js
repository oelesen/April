// Diese Komponente nimmt einen Vereinsnamen als Prop und gibt einen vereinfachten oder modifizierten Namen zurück.
// Sie wird verwendet, um lange oder komplexe Vereinsnamen in kürzere, lesbare Formate umzuwandeln.

//import React from 'react';

// Komponente Truppe: Verarbeitet Vereinsnamen und gibt modifizierte Namen zurück
const Truppe = (props) => {
  let name = props.name; // Der eingehende Vereinsname aus den Props

  // Überprüfung spezifischer Vereinsnamen und Rückgabe modifizierter Namen
  if (name.includes('Dörpum')) {
    return 'Dörpum II'; // Vereinfachter Name für SV Dörpum II
  }
  if (name.includes('Süderlügum')) {
    return 'Süderlügum'; // Übersetzung und Aufteilung des Namens
  }
  if (name.includes('Mitte')) {
    return 'Mitte NF II'; // Aufteilung in zwei Zeilen
  }
  if (name.includes('Norddörfer')) {
    return 'Norddörfer' + '\n' + 'nur der SCN'; // Spezifische Anmerkung für SCN
  }
  if (name.includes('Drelsdorf')) {
    return 'Drelsdorf'; // Vereinfachung des Namens
  }
  if (name.includes('Wiedingh')) {
    return 'Wiedingh.' + '\n' + 'Emmelsbüll'; // Abkürzung und Aufteilung
  }
  if (name.includes('Ellingstedt')) {
    return 'Ellingstedt' + '\n' + 'Silberstedt'; // Vereinfachter Name
  }
  if (name.includes('Husum')) {
    return 'Husum II'; // Vereinfachter Name
  }
  if (name.includes('Stedesand')) {
    return 'Stedesand'; // Rückgabe des Originalnamens
  }
  if (name.includes('Klixbüll')) {
    return 'Klixbüll'; // Aufteilung des Namens
  }
  if (name.includes('Nordau')) {
    return 'Nordau II'; // Aufteilung in zwei Zeilen
  }
  if (name.includes('Löwenstedt')) {
    return 'Löwenstedt III'; // Vereinfachter Name
  }
  if (name.includes('Arlewatt')) {
    return 'Arlewatt II'; // Vereinfachter Name
  }
  if (name === 'SPIELFREI') {
    return 'SPIELFREI';
  }
  return name; // Return original name when no mapping matches
};

// Export der Komponente für die Verwendung in anderen Dateien
export default Truppe;
