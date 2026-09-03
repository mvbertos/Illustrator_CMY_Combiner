/// <reference types="../node_modules/types-for-adobe/Illustrator/2022"/>

const doc = app.documents.add();
const dialog = new Window("dialog", "Select Color Combination");
var size = 10;
var progression = 5;
var gap = 2;

function drawCombination(x, p) {
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
      fillColor.cyan = 0;
      fillColor.magenta = 0;
      fillColor.yellow = 0;
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
  dialog.orientation = "column";
  dialog.spacing = gap;
  dialog.margins = gap;

  //Box size
  const sizeInputField = createInputField("Size:", size.toString());

  //Spacing distance
  const gapInputField = createInputField("Gap:", gap.toString());

  //Progression
  const progInputField = createInputField(
    "Progression:",
    progression.toString(),
  );

  //Color Selection
  const colorArray = ["CM", "CY", "MY", "All"];
  const op = createDropdownEl("First Color:", colorArray);

  const btnGroup = dialog.add("group");
  btnGroup.orientation = "row";

  const btnCancel = btnGroup.add("button", undefined, "Cancel", {
    name: "cancel",
  });

  const btnOk = btnGroup.add("button", undefined, "OK", {
    name: "ok",
  });

  if (dialog.show() === 1) {
    gap = mmToPt(parseFloat(gapInputField.text));
    size = mmToPt(parseFloat(sizeInputField.text));
    progression = parseFloat(progInputField.text);
    drawCombination(op.selection.toString(), progression);
  }
}

function createInputField(labelValue, defaultValue) {
  const inputGroup = dialog.add("group");
  inputGroup.orientation = "row";
  inputGroup.alignment = "left";
  const labelEl = inputGroup.add("statictext", undefined, labelValue);
  const inputField = inputGroup.add("edittext", undefined, defaultValue);
  return inputField;
}

function createDropdownEl(labelValue, options) {
  const ddGroup = dialog.add("group");
  ddGroup.orientation = "row";
  ddGroup.alignment = "left";
  const labelEL = ddGroup.add("statictext", undefined, labelValue);
  const dropdown = ddGroup.add("dropdownlist", undefined, options);
  dropdown.selection = 0;
  return dropdown;
}

function mmToPt(value) {
  return value * 2.834645669;
}

showDialog();
