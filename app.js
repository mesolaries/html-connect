/*
 * @Author: Emil
 * @Date:   2019-08-29 17:22:25
 * @Last Modified by:   Emil
 * @Last Modified time: 2019-09-01 02:20:53
 */


/**
 * [drawVerticalLine description]
 * @param  {string}  firstElement  [first element/last line Jquery selector]
 * @param  {string}  secondElement [second element Jquery selector]
 * @param  {int}     lineCount     [Last drawn line count]
 * @param  {[array]}   obstacles     [positions of all obstacles]
 * @param  {Boolean}   fromElement   [checks whether line starting from element or line]
 * @param  {string}    hLineDir      [in which direction last line was drawn]
 * @return {function}              [calls drawHorizontalLine function]
 */
function drawVerticalLine(firstElement, secondElement,
  lineCount, obstacles,
  fromElement = false, hLineDir = '') {
  console.log("Drawing vertical line...");

  // First Element/Line Length
  let firstWidth = Math.ceil($(firstElement).outerWidth());
  let firstHeight = Math.ceil($(firstElement).outerHeight());
  // Second Element Length
  let secondWidth = Math.ceil($(secondElement).outerWidth());
  let secondHeight = Math.ceil($(secondElement).outerHeight());

  // First Element/Line Positions
  let firstXStart = Math.ceil($(firstElement).offset().left);
  let firstXCenter = Math.ceil($(firstElement).offset().left + firstWidth / 2);
  let firstXEnd = Math.ceil($(firstElement).offset().left + firstWidth);
  let firstYStart = Math.ceil($(firstElement).offset().top);
  let firstYCenter = Math.ceil($(firstElement).offset().top + firstHeight / 2);
  let firstYEnd = Math.ceil($(firstElement).offset().top + firstHeight);

  // Second Element Positions
  let secondXStart = Math.ceil($(secondElement).offset().left);
  let secondXCenter = Math.ceil($(secondElement).offset().left + secondWidth / 2);
  let secondXEnd = Math.ceil($(secondElement).offset().left + secondWidth);
  let secondYStart = Math.ceil($(secondElement).offset().top);
  let secondYCenter = Math.ceil($(secondElement).offset().top + secondHeight / 2);
  let secondYEnd = Math.ceil($(secondElement).offset().top + secondHeight);


  lineCount++;
  $('body').append(`<div class="line line-${lineCount}"></div>`);
  let line = $(`.line-${lineCount}`);

  // Check direction
  let dir;

  if (fromElement) {
    if (firstXCenter < secondXCenter) {
      dir = 'right';
    } else if (firstXCenter > secondXCenter) {
      dir = 'left';
    } else {
      dir = 'same';
    }
  } else {
    dir = 'same';
    if (hLineDir === 'left') {
      if (firstXStart < secondXCenter) {
        dir = 'right';
      } else if (firstXStart > secondXCenter) {
        dir = 'left';
      }
    } else if (hLineDir === 'right') {
      if (firstXEnd < secondXCenter) {
        dir = 'right';
      } else if (firstXEnd > secondXCenter) {
        dir = 'left';
      }
    }
  }

  // Check if elements is same or intersecting by height
  if (fromElement && (firstYEnd >= secondYStart && firstYEnd <= secondYEnd)) {
    line.css({
      'width': '10px',
      'transform': 'rotate(90deg)'
    });
    line.offset({
      'top': firstYStart - 10,
      'left': firstXCenter
    });
    return drawHorizontalLine(`.line-${lineCount}`, '.below',
      lineCount, obstacles,
      dir, wentUp = true);
  }


  // Put the line to start position
  line.css({
    'width': '0',
    'transform': 'rotate(90deg)'
  });
  line.offset({
    'top': firstYEnd,
    'left': firstXCenter
  });
  if (!fromElement) {
    if (hLineDir === 'left') {
      line.offset({
        'top': firstYEnd,
        'left': firstXStart
      });
    } else if (hLineDir === 'right') {
      line.offset({
        'top': firstYEnd,
        'left': firstXEnd
      });
    }
  }

  // Drawing the line...
  for (let i = firstYEnd, h = 0; i <= secondYStart; i++, h++) {
    for (let j = 0; j < obstacles.length; j++) {
      line.css('width', h);
      if (
        i === obstacles[j].y &&
        (
          line.offset().left >= obstacles[j].x &&
          line.offset().left <= obstacles[j].x + obstacles[j].w
        )
      ) {
        line.css('width', line.outerWidth() - Math.ceil(h * 0.25));
        if (line.offset().left === secondXCenter) {
          console.log("Drawing fallback horizontal line...");
          lineCount++;
          $('body').append(`<div class='line line-${lineCount}'></div>`);
          newLine = $(`.line-${lineCount}`);
          newLine.offset({
            'top': line.offset().top + line.outerWidth(),
            'left': obstacles[j].x - 10
          });
          newLine.css('width', Math.ceil(obstacles[j].w / 2) + 10);
          return drawVerticalLine(`.line-${lineCount}`, '.below',
                                  lineCount, obstacles,
                                  fromElement = false, hLineDir = 'left');
        }
        return drawHorizontalLine(`.line-${lineCount}`, '.below', lineCount, obstacles, dir);
      } else if (i === secondYStart && line.offset().left !== secondXCenter) {
        line.css('width', line.outerWidth() - Math.ceil(h * 0.25));
        return drawHorizontalLine(`.line-${lineCount}`, '.below', lineCount, obstacles, dir);
      }
    }
  }
  return drawHorizontalLine(`.line-${lineCount}`, '.below', lineCount, obstacles, dir);
}


/**
 * [drawHorizontalLine description]
 * @param  {string}  firstElement  [last line Jquery selector]
 * @param  {string}  secondElement [second element Jquery selector]
 * @param  {int}     lineCount     [Last drawn line count]
 * @param  {[array]}   obstacles     [positions of all obstacles]
 * @param  {string}  dir           [in which direction the line will be drawn]
 * @param  {Boolean}   wentUp        [checks whether previous line went up or down]
 * @return {function}              [calls drawVerticalLine function or stops executing]
 */
function drawHorizontalLine(firstElement, secondElement,
  lineCount, obstacles,
  dir, wentUp = false) {
  console.log("Drawing horizontal line...");

  // First element is always Vertical Line
  // First Line Length
  let firstLength = Math.ceil($(firstElement).outerWidth());
  // Second Element Length
  let secondWidth = Math.ceil($(secondElement).outerWidth());
  let secondHeight = Math.ceil($(secondElement).outerHeight());

  // First Line Positions
  let firstX = Math.ceil($(firstElement).offset().left);
  let firstYStart = Math.ceil($(firstElement).offset().top);
  let firstYCenter = Math.ceil($(firstElement).offset().top + firstLength / 2);
  let firstYEnd = Math.ceil($(firstElement).offset().top + firstLength);

  // Second Element Positions
  let secondXStart = Math.ceil($(secondElement).offset().left);
  let secondXCenter = Math.ceil($(secondElement).offset().left + secondWidth / 2);
  let secondXEnd = Math.ceil($(secondElement).offset().left + secondWidth);
  let secondYStart = Math.ceil($(secondElement).offset().top);
  let secondYCenter = Math.ceil($(secondElement).offset().top + secondHeight / 2);
  let secondYEnd = Math.ceil($(secondElement).offset().top + secondHeight);


  // Finish if the goal is reached
  if (firstYStart + firstLength === secondYStart && firstX === secondXCenter) {
    return;
  }


  lineCount++;
  $('body').append(`<div class="line line-${lineCount}"></div>`);

  let line = $(`.line-${lineCount}`);
  let i; // Horizontal line start position
  let end; // Horizontal line end position
  let hLineDir; // Direction of line

  // Put the line to start position
  line.css('width', '0');

  if (dir === 'right') {
    i = firstX;
    end = secondXCenter;
    hLineDir = 'right';
    line.offset({
      'top': firstYEnd,
      'left': firstX
    });
  } else if (dir === 'left') {
    i = secondXCenter;
    end = firstX;
    hLineDir = 'left';
    line.offset({
      'top': firstYEnd,
      'left': secondXCenter
    });
    for (let c = 0; c < obstacles.length; c++) {
      if (firstX < obstacles[c].x || secondXStart > obstacles[c].x) {
        continue;
      }
      if (!wentUp) {
        if (firstYEnd >= obstacles[c].y && firstYEnd <= obstacles[c].y + obstacles[c].h) {
          let obstacleXEnd = obstacles[c].x + obstacles[c].w;
          i = obstacleXEnd + Math.ceil(obstacleXEnd * 0.25);
          line.offset({
            'top': firstYEnd,
            'left': i
          });
        }
      } else {
        if (firstYStart >= obstacles[c].y && firstYStart <= obstacles[c].y + obstacles[c].h) {
          let obstacleXEnd = obstacles[c].x + obstacles[c].w;
          i = obstacleXEnd + Math.ceil(obstacleXEnd * 0.25);
          line.offset({
            'top': firstYStart,
            'left': i
          });
        }
      }
    }
  }

  if (wentUp) {
    line.offset({
      'top': firstYStart
    });
  }

  // Drawing the line...
  for (let l = 0; i <= end; i++, l++) {
    for (let j = 0; j < obstacles.length; j++) {
      line.css('width', l);
      if (dir === 'right') {
        if (
          line.offset().left + line.outerWidth() === obstacles[j].x &&
          (
            line.offset().top >= obstacles[j].y &&
            line.offset().top <= obstacles[j].y + obstacles[j].h
          )
        ) {
          line.css('width', line.outerWidth() - Math.ceil(l * 0.25));
          return drawVerticalLine(`.line-${lineCount}`, '.below',
            lineCount, obstacles,
            false, hLineDir);
        }
      } else if (dir === 'left') {
        if (line.offset().left + line.outerWidth() === firstX) {
          return drawVerticalLine(`.line-${lineCount}`, '.below',
                                  lineCount, obstacles,
                                  false, hLineDir);
        }
      }
    }
  }
  return drawVerticalLine(`.line-${lineCount}`, '.below',
                          lineCount, obstacles,
                          false, hLineDir);
}


/**
 * [elementsInArray description]
 * @param  {string} elements [Jquery selector]
 * @return {[array]}           [Returns all elements in array]
 */
function elementsInArray(elements) {
  let elementsArray = [];
  elements.each(function() {
    let offset = $(this).offset();
    let width = $(this).outerWidth();
    let height = $(this).outerHeight();
    elementsArray.push({
      'x': Math.ceil(offset.left),
      'y': Math.ceil(offset.top),
      'w': Math.ceil(width),
      'h': Math.ceil(height)
    });
  });
  return elementsArray;
}


/**
 * [deleteSelectedElement description]
 * @param  {string} element [Jquery selector]
 * @param  {[array]}  array   [All elements array]
 * @return {[array], undefined}          [Returns array without selected element]
 */
function deleteSelectedElement(element, array) {
  let index = array.findIndex(
    e => e.x === Math.ceil($(element).offset().left) &&
    e.y === Math.ceil($(element).offset().top) &&
    e.w === Math.ceil($(element).outerWidth()) &&
    e.h === Math.ceil($(element).outerHeight())
  );
  if (index === -1) {
    return;
  }
  return array.splice(index, 1);
}


/**
 * [selectedElementsCount description]
 * @param  {string} selected [selected element Jquery selector]
 * @param  {int}    count    [count of already selected elements]
 * @return {int}             [count of selected elements]
 */
function selectedElementsCount(selected, count) {
  if (!$(selected).hasClass('selected') && count < 2) {
    count++;
    $(selected).addClass('selected count' + count);
  } else if (!$(selected).hasClass('selected') && count === 2) {
    $('.count2').removeClass();
    $(selected).addClass('selected count2');
  } else {
    if ($(selected).hasClass('count1')) {
      $('.count2').removeClass('count2').addClass('selected count1');
    }
    $(selected).removeClass();
    count--;
  }
  return count;
}


// Initialization
$(function() {
  let elements = $('a');
  let selectedCount = 0;
  let lineCount = 0;
  elements.on('click', function() {
    $('.line').remove();
    $('.above, .below').removeClass('above below');
    selectedCount = selectedElementsCount(this, selectedCount);
    if (selectedCount === 2) {
      if ($('.count1').offset().top > $('.count2').offset().top) {
        $('.count1').addClass('below');
        $('.count2').addClass('above');
      } else if ($('.count1').offset().top <= $('.count2').offset().top) {
        $('.count1').addClass('above');
        $('.count2').addClass('below');
      }
      // Adding elements to array
      let elementArray = elementsInArray(elements);
      deleteSelectedElement('.above', elementArray);
      deleteSelectedElement('.below', elementArray);
      drawVerticalLine('.above', '.below', lineCount, elementArray, true);
    }
  });
});