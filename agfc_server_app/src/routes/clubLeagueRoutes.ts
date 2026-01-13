import express from 'express';
import { leagueStatisticsController } from '../controllers/leagueStatistics.controller';
import { validateLeagueStatistics } from '../validations/leagueStatistics.validation';

const router = express.Router();

// Create league statistics
router.post(
  '/', 
  validateLeagueStatistics.create,
  leagueStatisticsController.createStatistics.bind(leagueStatisticsController)
);

// Get all statistics for a league
router.get(
  '/league/:leagueId', 
  validateLeagueStatistics.getAll,
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
  validateLeagueStatistics.getById,
  leagueStatisticsController.getStatisticsById.bind(leagueStatisticsController)
);

// Get team statistics
router.get(
  '/league/:leagueId/team/:team', 
  validateLeagueStatistics.getTeamStats,
  leagueStatisticsController.getTeamStatistics.bind(leagueStatisticsController)
);

// Update statistics
router.put(
  '/:id', 
  validateLeagueStatistics.update,
  leagueStatisticsController.updateStatistics.bind(leagueStatisticsController)
);

// Delete statistics
router.delete(
  '/:id', 
  validateLeagueStatistics.getById,
  leagueStatisticsController.deleteStatistics.bind(leagueStatisticsController)
);

// Update match result
router.post(
  '/league/:leagueId/match', 
  validateLeagueStatistics.updateMatchResult,
  leagueStatisticsController.updateMatchResult.bind(leagueStatisticsController)
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