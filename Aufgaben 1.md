# Aufgabe 1: The Science of Rendering Photorealistic CGI
## Was versteht man unter Rasterization? Was sind die Grenzen und Herausforderungen dieser Technologie?
Bei der Rasterization werden die Eckpunkte der 3D-Objekte auf die 2D-Bildschirmfläche projiziert.
Durch diese Eckpunkte ergibt sich dann der Umriss des darzustellenden Objekts.
Um die Tiefen-Informationen zu erhalten, müssen diese individuell berechnet werden, beziehungsweise durch eine separate Tiefen-Informations-Darstellung berechnet werden.
Insgesamt werden nur die Objekte projiziert, die im Bereich des Sichtfelds liegen.
## Was versteht man unter Ray Casting? Was sind die Grenzen und Herausforderungen dieser Technologie?
Im Gegensatz zu der Rasterization werden hier die Objekte nicht durch ihre Eckpunkte, sondern durch die Strahlen, die von der Kamera ausgehen, dargestellt.
Dabei wird durch jeden darzustellenden Pixel auf der Projektionsebene ein Ray (Strahl) gesendet.
Bei der ersten Kollision mit einem Objekt wird die Farbe des Objekts zurückgegeben, wodurch dieses auf der Projektionsebene dargestellt wird.
## Was versteht man unter Ray Tracing? Was sind die Grenzen und Herausforderungen dieser Technologie?
Das Ray Tracing ist eine Weiterentwicklung des Ray Castings.
Hierbei werden ausgehend von den ersten Kollisionen mit Objekten weitere Strahlen in verschiedene Richtungen gesendet.
Diese zeigen dabei zu den Lichtquellen, sowie bei reflektierenden oder durchsichtigen Objekten in die Reflexions-, beziehungsweise Brech-Richtung.
Bei weiteren Kollisionen, wird das genannte Verfahren wiederholt.
Somit wird der Lichtstrahl von der Kamera bis zu seinen ursprünglichen Lichtquellen zurückverfolgt.
Jede Kollision beeinflusst dabei die resultierende Farbe auf der Projektionsebene.