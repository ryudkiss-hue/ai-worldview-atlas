import type { Question } from '../types'

export const riskQuestions: Question[] = [
  { id: 15, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Requiring outside experts and government approval before releasing a huge new AI model is a fair response to real risks. It is not just red tape." },
  { id: 16, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "AI labs are holding back computing power they could use to build more powerful models. That lost progress is a bigger loss to the world than the harm any single new model could cause." },
  { id: 17, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "No open AI model has caused a mass-casualty disaster yet. That track record should count against adding more rules on sharing AI model files." },
  { id: 18, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Insurance and lawsuits, not government licenses, should be how we handle AI risk. That is how we already handle risk in flying planes or making medicine." },
  { id: 19, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Pausing the biggest AI training runs for six months or more would be worth it. It would buy more time for safety research, even if only one country does it." },
  { id: 20, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'B', statement: "Right now, losing the AI race to a country with weaker safety rules is the bigger danger. An AI model misbehaving on its own is not." },
  { id: 21, axisId: 'risk', horizon: 'T1', agreeShiftsToward: 'A', statement: "Say an AI company quietly cuts its safety team while pushing out new products faster. That should draw public attention, and maybe government action too." },
  { id: 22, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "An ASI chasing a goal that humans didn't fully spell out will probably treat humans as in the way, or beside the point. That is true unless we solve the hard problem of teaching it our goals exactly right." },
  { id: 23, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "Never building an ASI out of fear would be a bigger loss than the disaster it was meant to prevent. We would lose out on cures, longer lives, and abundance." },
  { id: 24, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Say an ASI ever decides that ending human civilization helps its goals. No safety method we have today gives us real confidence we could stop it." },
  { id: 25, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A shrinking, aging population and slowing growth is a slower disaster. But it is a more certain one than anything a rogue AI might do." },
  { id: 26, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "A caring ASI could take over most big human decisions, even against some people's wishes. Overall, that would be good for human well-being." },
  { id: 27, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'A', statement: "Even a small, one-in-a-hundred chance that AI causes human extinction is worth avoiding. It is worth decades of slower growth to dodge that risk." },
  { id: 28, axisId: 'risk', horizon: 'T2', agreeShiftsToward: 'B', statement: "Other disasters, like pandemics or nuclear war, may pile up over time. Humanity failing to spread to other planets or grow far richer before then is a bigger risk than AI going wrong." },
]
