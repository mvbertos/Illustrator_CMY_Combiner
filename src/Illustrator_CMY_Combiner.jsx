/// <reference types="../node_modules/types-for-adobe/Illustrator/2022"/>

//Defualt Values
var size = 10;
var progression = 5;
var gap = 2;

//Creates Dialog
const dialog = new Window("dialog", "Select Color Combination");
dialog.orientation = "column";
dialog.spacing = gap;
dialog.margins = gap;

function drawCombination(x, p, baseColors) {
  const doc = app.documents.add();
  const count = 100 / p;
  for (var j = 0; j < count + 1; j++) {
    for (var i = 0; i < count + 1; i++) {
      if (i === j && j === 0) {
        continue;
      } else if (i == 0) {
        var text = doc.textFrames.add();
        text.position = [-(size / 2), j * (size + gap)];
        text.contents = (j * p).toString() + x[0];
        continue;
      } else if (j == 0) {
        var text = doc.textFrames.add();
        text.position = [i * (size + gap), 0];
        text.contents = (i * p).toString() + x[1];
        continue;
      }

      var fillColor = new CMYKColor();
      fillColor.cyan = baseColors[0];
      fillColor.magenta = baseColors[1];
      fillColor.yellow = baseColors[2];
      fillColor.black = 0;

      switch (x) {
        case "CM":
          fillColor.cyan = i * p;
          fillColor.magenta = j * p;
          break;
        case "CY":
          fillColor.cyan = i * p;
          fillColor.yellow = j * p;
          break;
        case "MY":
          fillColor.magenta = i * p;
          fillColor.yellow = j * p;
          break;
        case "All":
          fillColor.cyan = i * p;
          fillColor.magenta = i * p;
          fillColor.yellow = i * p;
          break;
      }

      var rect = doc.pathItems.rectangle(
        i * (size + gap),
        j * (size + gap),
        size,
        size,
      );
      rect.fillColor = fillColor;
    }
  }
}

function showDialog() {


  //Base values 
  const baseValuesText = dialog.add("statictext", undefined, "Base Values");
  const CyanField = createInputField("Cyan:", "0");
  const YellowField = createInputField("Yellow:", "0");
  const MagentaField = createInputField("Magenta:", "0");

  //Color Selection
  const colorArray = ["CM", "CY", "MY", "All"];
  const op = createDropdownEl("First Color:", colorArray);


  //Displaying
  const displayValuesText = dialog.add("statictext", undefined, "Display Settings");

  //Box size
  const sizeInputField = createInputField("Size:", size.toString());

  //Spacing distance
  const gapInputField = createInputField("Gap:", gap.toString());

  //Progression
  const progInputField = createInputField(
    "Progression:",
    progression.toString(),
  );

  //Advenced
  const advencedText = dialog.add("statictext", undefined, "Advenced Settings")
  const repField = createInputField("Repetitions:", "1");
  const CyanIncField = createInputField("Cyan:", "0");
  const YellowIncField = createInputField("Yellow:", "0");
  const MagentaIncField = createInputField("Magenta:", "0");

  const btnGroup = dialog.add("group");
  btnGroup.orientation = "row";

  const btnCancel = btnGroup.add("button", undefined, "Cancel", {
    name: "cancel",
  });

  const btnOk = btnGroup.add("button", undefined, "OK", {
    name: "ok",
  });

  if (dialog.show() === 1) {
    const g = mmToPt(parseFloat(gapInputField.text));
    const s = mmToPt(parseFloat(sizeInputField.text));
    const p = parseFloat(progInputField.text);
    const r = parseInt(repField.text);
    const bColors = [parseInt(CyanField.text), parseInt(YellowField.text), parseInt(MagentaField.text)];
    const pColors = [parseInt(CyanIncField.text), parseInt(YellowIncField.text), parseInt(MagentaIncField.text)];
    onSubmit(g, s, p, op.selection.toString(), r, bColors, pColors);
  }
}

function onSubmit(gap, size, progression, op, repetitions, baseColors, repInc) {
  this.gap = gap;
  this.size = size;
  this.progression = progression;
  var colors = baseColors;
  for (var i = 0; i < repetitions; i++) {
    drawCombination(op, progression, colors);
    colors = [baseColors[0] + (i * repInc[0]), baseColors[1] + (i * repInc[1]), baseColors[2] + (i * repInc[2])];
  }
}

function createInputField(labelValue, defaultValue) {
  const inputGroup = dialog.add("group");
  inputGroup.orientation = "row";
  inputGroup.alignment = "left";
  const labelEl = inputGroup.add("statictext", undefined, labelValue);
  labelEl.preferredSize.width = 100;
  const inputField = inputGroup.add("edittext", undefined, defaultValue);
  inputField.preferredSize.width = 100;
  return inputField;
}

function createDropdownEl(labelValue, options) {
  const ddGroup = dialog.add("group");
  ddGroup.orientation = "row";
  ddGroup.alignment = "left";
  const labelEL = ddGroup.add("statictext", undefined, labelValue);
  labelEL.preferredSize.width = 100;
  const dropdown = ddGroup.add("dropdownlist", undefined, options);
  dropdown.preferredSize.width = 100;
  dropdown.selection = 0;
  return dropdown;
}

function mmToPt(value) {
  return value * 2.834645669;
}

showDialog();
