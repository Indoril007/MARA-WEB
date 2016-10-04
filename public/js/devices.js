

function Button(name, imgPath, scale, offsetX, offsetY, description) {
	this.name = name;
	this.imgPath = imgPath;
	this.scale = scale;
	this.offsetX = offsetX;
	this.offsetY = offsetY;
	this.description = description;
}

Button.prototype.getARImageDrawable = function() {
	var overlayImg = new AR.ImageResource(this.imgPath);
	return new AR.ImageDrawable(overlayImg, this.scale, {offsetX: this.offsetX, offsetY: this.offsetY});
}

Button.parseJSONobject = function(object) {
	var button = new Button(object.name, object.imgPath, object.scale, object.offsetX, object.offsetY, object.description);
	return button;
}

function Step(index, buttons, description) {
	this.index = index;
	this.buttons = buttons || [];
	this. description = description;
}

Step.prototype.addButtons = function(buttons) {
	for(var i = 0; i < buttons.length; i++) {
		this.buttons.push(buttons[i]);
	}
}

Step.prototype.addDescription = function(description) {
	this.description.push(description);
}

Step.parseJSONobject = function(object) {
	var step = new Step(object.index, null, object.description);
	for(var i = 0; i < object.buttons.length; i++) {
		step.addButtons([Button.parseJSONobject(object.buttons[i])]);
	}
	return step;
}

function Tutorial(name, steps) {
	this.name = name;
	this.steps = steps || [];
}

Tutorial.prototype.addStep = function(step) {
	this.steps.push(step);
}

Tutorial.parseJSONobject = function(object) {
	var tutorial = new Tutorial(object.name, null);
	for(var i = 0; i < object.steps.length; i++) {
		tutorial.addStep(Step.parseJSONobject(object.steps[i]));
	}
	return tutorial;
}

function Device(name, buttons, tutorialButton, tutorials) {
	this.name = name;
	this.buttons = buttons || [];
	this.tutorialButton = tutorialButton;
	this.tutorials = tutorials || {};
}

Device.prototype.addButtons = function(buttons) {
	for(var i = 0; i < buttons.length; i++) {
		this.buttons.push(buttons[i]);
	}
}

Device.prototype.addTutorialButton = function(tutorialButton) {
	this.tutorialButton = tutorialButton;
}

Device.prototype.addTutorial = function(tutorial) {
	this.tutorials[tutorial.name] = tutorial;
}

Device.parseJSONobject = function(object) {
	var device = new Device(object.name, null, null, null);
	
	for(var i = 0; i < object.buttons.length; i++) {
		device.addButtons([Button.parseJSONobject(object.buttons[i])]);
	}
	
	device.addTutorialButton(Button.parseJSONobject(object.tutorialButton));
	
	for (var key in object.tutorials) {
		if (object.tutorials.hasOwnProperty(key)) {
			device.addTutorial(Tutorial.parseJSONobject(object.tutorials[key]));
		}
	}
	
	return device;
}

Device.parseJSONobjects = function(objects) {
	var devices = {};
	for (var key in objects) {
		if (objects.hasOwnProperty(key)) {
			devices[key] = Device.parseJSONobject(objects[key]);
		}
	}
	return devices;
}



function Target(name, targetCollectionId, buttons, tutorialButton, tutorials) {
	this.name = name;
	this.targetCollectionID = targetCollectionId;
	this.buttons = buttons || [];
	this.tutorialButton = tutorialButton;
	this.tutorials = tutorials || {};
}

Target.prototype.addButtons = function(buttons) {
	for(var i = 0; i < buttons.length; i++) {
		this.buttons.push(buttons[i]);
	}
}

Target.prototype.addTutorialButton = function(tutorialButton) {
	this.tutorialButton = tutorialButton;
}

Target.prototype.addTutorial = function(tutorial) {
	this.tutorials[tutorial.name] = tutorial;
}

Target.parseJSONobject = function(object) {
	var target = new Target(object.name, targetCollectionId, null, null, null);
	
	for(var i = 0; i < object.buttons.length; i++) {
		target.addButtons([Button.parseJSONobject(object.buttons[i])]);
	}
	
	if (object.tutorialButton) target.addTutorialButton(Button.parseJSONobject(object.tutorialButton));
	
	if (object.tutorials) {
		for (var key in object.tutorials) {
			if (object.tutorials.hasOwnProperty(key)) {
				target.addTutorial(Tutorial.parseJSONobject(object.tutorials[key]));
			}
		}
	}
	
	return target;
}

Target.parseJSONobjects = function(objects) {
	var targets = {};
	for (var key in objects) {
		if (objects.hasOwnProperty(key)) {
			targets[key] = Target.parseJSONobject(objects[key]);
		}
	}
	return targets;
}

