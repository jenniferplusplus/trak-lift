'use strict';

export class Exercise {
    kind = 'exercise';
    /** @var {string} name */
    name;
    /** @var {Date} [start] */
    start;
    /** @var {Date} [stop] */
    stop;
    /** @var {URL} [guide] */
    guide;
}

export class ExerciseWeight extends Exercise {
    kind = 'weight';
    /** @var {Number} weight */
    weight;
    /** @var {Number} reps=1 */
    reps = 1;
    /** @var {Number} sets=1 */
    sets = 1;
}

export class ExerciseDistance extends Exercise {
    kind = 'distance';
    /** @var {Number} distance */
    distance;
    /** @var {string} unit */
    unit;
}

export class ExerciseEffort extends Exercise {
    kind = 'effort';
    /** @var {Number} effort */
    effort;
}

export class Routine {
    /** @var {string} name */
    name;
    /** @var {[Exercise]} exercises */
    exercises = [];
}

export class Plan {
    /** @var {string} kind */
    kind;
    /** @var {string} name */
    name;
    /** @var {[Routine]} routines */
    routines = [];
}

export class PlanSchedule extends Plan {
    kind = 'schedule';
    /** @var {CronString} schedule */
    schedule;
}

export class PlanFlow extends Plan {
    kind = 'flow';
    /** @var {FlowString} flow */
    flow;
    // TBD, but I'm imagining something like E = exercise, R = rest, _ = range
    // Ex: E_ R E__
    // day 1 or 2: exercise
    // day 3: rest
    // day 4, 5 or 6: exercise
}

export class Session {
    /** @var {Date} start */
    start;
    /** @var {Date} stop */
    stop;
    /** @var {[Exercise]} exercises */
    exercises;
    /** @var {string} routine */
    routine;
}