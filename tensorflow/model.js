import * as tf from '@tensorflow/tfjs-node';

export function string2StringModel(hiddenSize, inputSize, numberOfChars) {
    const model = tf.sequential();

    // input layer
    model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        inputShape: [inputSize, numberOfChars]
    }))

    model.add(tf.layers.repeatVector({ n: inputSize }));

    model.add(tf.layers.simpleRNN({
        units: hiddenSize,
        recurrentInitializer: 'glorotNormal',
        returnSequences: true
    }))

    model.add(tf.layers.timeDistributed(
        { layer: tf.layers.dense({ units: numberOfChars }) }));
    model.add(tf.layers.activation({ activation: 'softmax' }));
    
    model.compile({
        loss: 'categoricalCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy']
    });

    return model;
}

export function string2UppercaseIndicesModel(hiddenSize, inputSize, numberOfChars) {
    
    const model = tf.sequential();

    model.add(tf.layers.bidirectional({ 
        layer: tf.layers.lstm({ 
            units: Math.floor(hiddenSize / 2)
        }),
        inputShape: [inputSize, numberOfChars]
    }))

    model.add(tf.layers.dropout({ rate: 0.5 }))

    model.add(tf.layers.dense({ 
        units: hiddenSize,
        activation: "relu",
    }))

    model.add(tf.layers.dropout({ rate: 0.5 }))

    model.add(tf.layers.dense({ 
        units: inputSize,
        activation: "sigmoid"
    }))
    
    model.summary()

    model.compile({
        loss: 'binaryCrossentropy',
        optimizer: 'adam',
        metrics: ['accuracy']
    })

    return model
}

export function string2UppercaseIndicesModelParts(hiddenSize, inputSize, numberOfChars) {
    
    const model = tf.sequential();

    model.add(tf.layers.flatten({
        inputShape: [inputSize, numberOfChars]
    }))

    model.add(tf.layers.dense({
        units: hiddenSize
    }))

    model.add(tf.layers.dense({
        units: hiddenSize
    }))


    model.add(tf.layers.dense({ 
        units: inputSize,
        activation: "sigmoid"
    }))
    
    model.summary()

    model.compile({
        loss: 'binaryCrossentropy',
        optimizer: tf.train.adam(),
        metrics: ['accuracy'],
    })

    return model
}