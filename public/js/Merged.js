var width = window.innerWidth / 2;
var height = window.innerHeight / 2;
var target_ratio;
var augm_ratio;
var stage;

var BackgroundLoader = document.getElementById('BackgroundLoader');
BackgroundLoader.addEventListener('change', handleBackground, false);

var AugmentImg = document.getElementById('AugmentImg');
AugmentImg.addEventListener('change', handleAugm, false);


/********************************************************************************************************************/
function handleBackground(evt) {
    var reader = new FileReader();
    reader.onload = function(event) {
        var background = new Konva.Layer();
        var img = new Image();
        img.onload = function() {
            target_ratio = img.width / img.height;
            //if (img.width > img.height){
            stage = new Konva.Stage({
                container: 'container',
                width: width,
                height: width / target_ratio
            });
            var TargetImg = new Konva.Image({
                x: 0,
                y: 0,
                image: img,
                width: width,
                height: width / target_ratio
            });
            // add the shape to the layer
            background.add(TargetImg);

            // add the layer to the stage
            stage.add(background);
        }

        img.src = event.target.result;
    }
    reader.readAsDataURL(evt.target.files[0]);
}

/********************************************************************************************************************/
function handleAugm(evt) {
    var reader2 = new FileReader();
    reader2.onload = function(event) {
        var tempImg = new Image();
        tempImg.onload = function() {
            augm_ratio = tempImg.width / tempImg.height;

            var layer1 = new Konva.Layer();
            stage.add(layer1);

            //1st augmentation image
            var AugImg_1 =new Konva.Image({
                width: tempImg.width,
                height: tempImg.height
            });

            var Aug1Group = new Konva.Group({
                x: 20,
                y: 110,
                draggable: true
            });
            


            // add the shape to the layer
            layer1.add(Aug1Group);
            Aug1Group.add(AugImg_1);
            addAnchor(Aug1Group, 0, 0, 'topLeft');
            addAnchor(Aug1Group, tempImg.width, 0, 'topRight');
            addAnchor(Aug1Group, tempImg.width, tempImg.height, 'bottomRight');
            addAnchor(Aug1Group, 0, tempImg.height, 'bottomLeft');
            //test = Aug1Group.get('.topLeft')[0].getAttr('x');
            //alert(test);

            AugImg_1.image(tempImg);
            layer1.draw();
        }
        //alert(event.target.result);
        tempImg.src = event.target.result;
    }
    reader2.readAsDataURL(evt.target.files[0]);
}

function update(activeAnchor) {
    var group = activeAnchor.getParent();

    var topLeft = group.get('.topLeft')[0];
    var topRight = group.get('.topRight')[0];
    var bottomRight = group.get('.bottomRight')[0];
    var bottomLeft = group.get('.bottomLeft')[0];
    var image = group.get('Image')[0];

    var anchorX = activeAnchor.getX();
    var anchorY = activeAnchor.getY();

    var dragWidth = topRight.getX() - topLeft.getX();
    var dragHeight = dragWidth / augm_ratio;

    // update anchor positions
    switch (activeAnchor.getName()) {
        case 'topLeft':
            topRight.setY(anchorY);
            bottomLeft.setX(anchorX);
            bottomLeft.setY(anchorY+dragHeight);
            bottomRight.setX(topRight.getX());
            bottomRight.setY(bottomLeft.getY());
            break;
        case 'topRight':
            topLeft.setY(anchorY);
            bottomRight.setX(anchorX);
            bottomRight.setY(anchorY+dragHeight);
            bottomLeft.setX(topLeft.getX());
            bottomLeft.setY(bottomRight.getY());
            break;
        case 'bottomRight':
            bottomLeft.setY(anchorY);
            topRight.setX(anchorX);
            topRight.setY(anchorY-dragHeight);
            topLeft.setX(bottomLeft.getX());
            topLeft.setY(topRight.getY());

            break;
        case 'bottomLeft':
            bottomRight.setY(anchorY);
            topLeft.setX(anchorX);
            topLeft.setY(anchorY+dragHeight);
            topRight.setX(bottomRight.getX());
            topRight.setY(topLeft.getY());
            break;
    }

    image.position(topLeft.position());

    var width = topRight.getX() - topLeft.getX();
    var height = bottomLeft.getY() - topLeft.getY();
    if (width && height) {
        image.width(width);
        image.height(height);
    }
}

function addAnchor(group, x, y, name) {
    var stage = group.getStage();
    var layer = group.getLayer();
    var anchor = new Konva.Circle({
        x: x,
        y: y,
        stroke: '#666',
        fill: '#ddd',
        strokeWidth: 2,
        radius: 8,
        name: name,
        draggable: true,
        dragOnTop: false
    });

    anchor.on('dragmove', function() {
        update(this);
        layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
        group.setDraggable(false);
        this.moveToTop();
    });
    anchor.on('dragend', function() {
        group.setDraggable(true);
        layer.draw();
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

    group.add(anchor);
}
