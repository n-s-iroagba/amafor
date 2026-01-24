import express from 'express';
import { LeagueStatisticsController } from '../controllers/LeagueStatisticsController';
import { validateLeagueStatistics } from '../validation-schema/leagueStatistics.validation';
import { validate } from '../middleware/validate';

const leagueStatisticsController = new LeagueStatisticsController();

const router = express.Router();

// Create league statistics
router.post(
  '/',
  validate(validateLeagueStatistics.create) as any,
  leagueStatisticsController.createStatistics.bind(leagueStatisticsController)
);

// Get all statistics for a league
router.get(
  '/league/:leagueId',
  validate(validateLeagueStatistics.getAll) as any,
  leagueStatisticsController.getAllStatistics.bind(leagueStatisticsController)
);

// Get league standings
router.get(
  '/league/:leagueId/standings',
  leagueStatisticsController.getLeagueStandings.bind(leagueStatisticsController)
);

// Get single statistics
router.get(
  '/:id',
  validate(validateLeagueStatistics.getById) as any,
  leagueStatisticsController.getStatisticsById.bind(leagueStatisticsController)
);

// Get team statistics
router.get(
  '/league/:leagueId/team/:team',
  validate(validateLeagueStatistics.getTeamStats) as any,
  leagueStatisticsController.getTeamStatistics.bind(leagueStatisticsController)
);

// Update statistics
router.put(
  '/:id',
  validate(validateLeagueStatistics.update) as any,
  leagueStatisticsController.updateStatistics.bind(leagueStatisticsController)
);

// Delete statistics
router.delete(
  '/:id',
  validate(validateLeagueStatistics.getById) as any,
  leagueStatisticsController.deleteStatistics.bind(leagueStatisticsController)
);

// Update match result
router.post(
  '/league/:leagueId/match',
  validate(validateLeagueStatistics.updateFixtureResult) as any,
  leagueStatisticsController.updateFixtureResult.bind(leagueStatisticsController)
);

// Get top scorers
router.get(
  '/league/:leagueId/top-scorers',
  leagueStatisticsController.getTopScorers.bind(leagueStatisticsController)
);

// Get top defenses
router.get(
  '/league/:leagueId/top-defenses',
  leagueStatisticsController.getTopDefenses.bind(leagueStatisticsController)
);

// Get form table
router.get(
  '/league/:leagueId/form',
  leagueStatisticsController.getFormTable.bind(leagueStatisticsController)
);

// Get home/away stats
router.get(
  '/league/:leagueId/home-away',
  leagueStatisticsController.getHomeAwayStats.bind(leagueStatisticsController)
);

// Get league summary
router.get(
  '/league/:leagueId/summary',
  leagueStatisticsController.getLeagueSummary.bind(leagueStatisticsController)
);

export default router;