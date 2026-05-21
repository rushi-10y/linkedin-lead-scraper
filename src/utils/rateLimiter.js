import Bottleneck from "bottleneck";

export const createLimiter = ({ minTime = 250, maxConcurrent = 2, reservoir, reservoirRefreshAmount, reservoirRefreshInterval } = {}) =>
  new Bottleneck({
    minTime,
    maxConcurrent,
    reservoir,
    reservoirRefreshAmount,
    reservoirRefreshInterval
  });
