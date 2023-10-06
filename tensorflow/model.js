import * as tf from '@tensorflow/tfjs-node';

export function rnnModel(hiddenSize, inputSize, numberOfChars) {
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