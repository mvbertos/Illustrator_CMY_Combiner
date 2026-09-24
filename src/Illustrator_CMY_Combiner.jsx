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

function drawCombination(x, p, c) {
  const doc = app.documents.add();
  const count = 100 / p;
  const base_c = createColor(c.cyan, c.magenta, c.yellow, 0);

  for (var j = 0; j < count + 1; j++) {
    var jValue = j * p;
    for (var i = 0; i < count + 1; i++) {
      var iValue = i * p;

      switch (x) {
        case "CM":
          c.cyan = clamp(0, base_c.cyan + iValue, 100);
          c.magenta = clamp(0, base_c.magenta + jValue, 100);
          break;
        case "CY":
          c.cyan = clamp(0, base_c.cyan + iValue, 100);
          c.yellow = clamp(0, base_c.yellow + jValue, 100);
          break;
        case "MY":
          c.magenta = clamp(0, base_c + iValue, 100);
          c.yellow = clamp(0, base_c.yellow + jValue, 100);
          break;
        case "All":
          c.cyan = clamp(0, base_c.cyan + iValue, 100);
          c.magenta = clamp(0, base_c.magenta + iValue, 100);
          c.yellow = clamp(0, base_c.yellow + iValue, 100);
          break;
      }

      if (i === j && j === 0) {
        continue;
      } else if (i == 0) {
        var text = doc.textFrames.add();
        text.position = [-(size / 2), j * (size + gap)];
        text.contents =
          c.cyan.toString() +
          "," +
          c.magenta.toString() +
          "," +
          c.yellow.toString();
        continue;
      } else if (j == 0) {
        var text = doc.textFrames.add();
        text.position = [i * (size + gap), 0];
        text.contents =
          c.cyan.toString() +
          "," +
          c.magenta.toString() +
          "," +
          c.yellow.toString();
        continue;
      }

      var rect = doc.pathItems.rectangle(
        i * (size + gap),
        j * (size + gap),
        size,
        size,
      );

      rect.fillColor = c;
    }
  }
}

function clamp(min, value, max) {
  return Math.min(Math.max(value, min), max);
}

function showDialog(submit) {
  //Base values
  const baseValuesText = dialog.add("statictext", undefined, "Base Values");
  const CyanField = createInputField("Cyan:", "0");
  const YellowField = createInputField("Yellow:", "0");
  const MagentaField = createInputField("Magenta:", "0");

  //Color Selection
  const colorArray = ["CM", "CY", "MY", "All"];
  const op = createDropdownEl("First Color:", colorArray);

  //Displaying
  const displayValuesText = dialog.add(
    "statictext",
    undefined,
    "Display Settings",
  );

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
  const advencedText = dialog.add("statictext", undefined, "Advenced Settings");
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
    const bColors = [
      parseInt(CyanField.text),
      parseInt(YellowField.text),
      parseInt(MagentaField.text),
      0,
    ];
    const pColors = [
      parseInt(CyanIncField.text),
      parseInt(YellowIncField.text),
      parseInt(MagentaIncField.text),
      0,
    ];
    submit(g, s, p, op.selection.toString(), r, bColors, pColors);
  }
}

function onSubmit(gap, size, progression, op, repetitions, baseColors, repInc) {
  this.gap = gap;
  this.size = size;
  this.progression = progression;

  for (var i = 0; i < repetitions; i++) {
    drawCombination(
      op,
      progression,
      createColor(
        baseColors[0] + i * repInc[0],
        baseColors[2] + i * repInc[2],
        baseColors[1] + i * repInc[1],
        0,
      ),
    );
  }
}

//FillColor
function createColor(c, m, y, k) {
  //Here lies variable of great inportance
  var color = new CMYKColor();
  color.cyan = c;
  color.magenta = m;
  color.yellow = y;
  color.black = k;
  return color;
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

showDialog(onSubmit);
