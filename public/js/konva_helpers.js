(function(window) {

window.konvaHelpers = {

	Augmentation: class  {
		constructor (id) {
			this.id = id;

			this.src = null;
			this.width = null;
			this.height = null;
			this.ratio = null;
			this.img = null;

			this.url = null;
			this.filename = null;
			this.description = null;
			this.X = null;
			this.Y = null;
			this.scale = null;
			this.wikitude_height = null;
			this.wikitude_width = null;
		}

		initSrc(file) {
			var self = this;

			return new Promise((resolve, reject) => {
				var reader = new FileReader();
				reader.onload = function(event){
					self.src = event.target.result;
					resolve();
				};
				reader.readAsDataURL(file);
			});
		}

		initImg() {
			var self = this;

			return new Promise((resolve, reject) => {
				var img = new Image();
				img.onload = function(){
					self.width = img.width;
					self.height = img.height;
					self.ratio = img.width / img.height;
					self.img = img;
					resolve();
				};
				img.src = self.src;
			});
		}
	},

	initKonvaBackground: function(backgroundUrl, width, containerID) {
		return new Promise((resolve, reject) => {
			console.log("HANDLING BACKGROUND");

		    var background = new Konva.Layer();
		    var img = new Image();
		    img.onload = function() {
		        background_ratio = img.width / img.height;
		        background_width = width;
		        background_height = width / background_ratio;
		        background_scale = background_width / img.width;

		        stage = new Konva.Stage({
		            container: containerID,
		            width: background_width,
		            height: background_height
		        });
		        var TargetImg = new Konva.Image({
		            x: 0,
		            y: 0,
		            image: img,
		            width: background_width,
		            height: background_height
		        });
		        // add the shape to the layer
		        background.add(TargetImg);

		        // add the layer to the stage
		        stage.add(background);

		        resolve({
		        			"stage": stage,
		        			"height": background_height,
		        			"width": background_width,
		        			"ratio": background_ratio,
		        			"scale": background_scale,
		        		});
		    }

		    img.src = backgroundUrl;
		});	
	},

	addAugmToKonva: function(background, augm) {
		augm.scale = (1/3);
		augm.wikitude_height = background.height;
		augm.wikitude_width = augm.wikitude_height * augm.ratio;
		console.log("original width: "+ augm.width);
	    console.log("scaled width: "+ augm.wikitude_width);


		var layer = new Konva.Layer();
		background.stage.add(layer);

		var konvaAugImg = new Konva.Image({
			width: augm.wikitude_width * augm.scale,
			height: augm.wikitude_height * augm.scale,
		});

		var konvaAugGroup = new Konva.Group({
			x: 20,
			y: 100,
			id: augm.id,
			draggable: true,
		});

		layer.add(konvaAugGroup);
		konvaAugGroup.add(konvaAugImg);

		addAnchor(konvaAugGroup, 0, 0, 'topLeft');
		addAnchor(konvaAugGroup, augm.wikitude_width * augm.scale, 0, 'topRight');
		addAnchor(konvaAugGroup, 0, augm.wikitude_height * augm.scale, 'bottomLeft');
		addDragAnchor(konvaAugGroup, background, augm, 'bottomRight');

		konvaAugImg.image(augm.img);
		console.log("augmentation group id is " + konvaAugGroup.id());
		layer.draw();
	},

}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var image = group.get('Image')[0];
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: false,
        dragOnTop: false
    });
    group.add(anchor);
}

function addDragAnchor(group, background, augm, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var image = group.get('Image')[0];
    var groupID = group.id();
    var anchor = new Konva.Circle({
        x: augm.wikitude_width * augm.scale,
        y: augm.wikitude_height * augm.scale,
        stroke: '#3B7508',
        fill: '#93FF33',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this, augm);
        layer.draw();
        console.log("dragmove");
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
        console.log("mousedown");
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
        console.log("dragend");
    });
    // add hover styling
    anchor.on('mouseover', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'pointer';
        this.setStrokeWidth(4);
        layer.draw();
    });
    anchor.on('mouseout', function() {
        var layer = this.getLayer();
        document.body.style.cursor = 'default';
        this.setStrokeWidth(2);
        layer.draw();
    });

    // group.on('mousedown touchstart', function() {
    //     if (!!augm_desc[groupID]){
    //         // description.value=augm_desc[groupID];
    //     }
    //     else{
    //     //display augmentation description text;
    //     // description.value="";
    // }
    //     tempid = groupID;
    //         //when touch down, read scale, ratios
    // });

    group.on('dragend', function() {
        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];

        augm.X = group.getX() + (topRight.getX() / 2);				//getting center of the group
        augm.X = (augm.X / background.width) - 0.5;					// wikitude take center of image as origin, canvas take top left corner as origin
        augm.X = augm.X * background.width / background.height;		// extra step: originally was scaled to the target width. this convert the offset X to scale of SDU
        augm.Y = group.getY() + (bottomRight.getY() / 2);
        augm.Y = ((augm.Y / background.height) - 0.5) * 1;			// wikitude take upwards as +ve, canvas take downwards as -ve

        console.log("Group X is " + augm.X);
        console.log("Group Y is " + augm.Y);
        console.log("Augmentation resize scale is " + augm.scale);
		console.log("groupID is: " + augm.id);
    });

    group.add(anchor);
}


function update(activeAnchor, augm) {
    var group = activeAnchor.getParent();
    var groupID = group.id();
	var arrayIndex = groupID - 1;
	
	
    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();


    var dragWidth = anchorX - bottomLeft.getX();
    var dragHeight = dragWidth / augm.ratio;
	
    // update anchor positions

    bottomLeft.setX(topLeft.getX());
    bottomLeft.setY(topLeft.getY() + dragHeight);
    topRight.setX(anchorX);
    topRight.setY(topLeft.getY());
    bottomRight.setY(topLeft.getY() + dragHeight);


    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }

    //calculate resize scale
    augm.scale = dragHeight / augm.wikitude_height;
}

}(window));