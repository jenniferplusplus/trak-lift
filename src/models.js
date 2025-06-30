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
    tokens;
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
    tokens;
}

export class Session {
    /** @var {Number} start */
    id;
    /** @var {Date} start */
    start;
    /** @var {Date} stop */
    stop;
    /** @var {[Exercise]} exercises */
    exercises;
    /** @var {string} routine */
    routine;
}

// wip
export class Plan {
    /** @var {string} kind */
    kind;
    /** @var {string} name */
    name;
}

// wip
export class PlanSchedule extends Plan {
    kind = 'schedule';
    /** @var {[{cron: string, routine: Routine}]} plan */
    plan;
}

// wip
export class PlanFlow extends Plan {
    kind = 'flow';
    /** @var {[Routine]} plan */
    plan;
}
