# Unused Code Detection Strategy

## Approach
1. **Analyze Controllers** - All controller methods must call services
2. **Analyze Services** - Track which service methods are called by controllers
3. **Analyze Repositories** - Track which repo methods are called by services
4. **Analyze Utils** - Track which utility functions are imported/used

## Method
- Use grep to find all method calls
- Cross-reference with method definitions
- Identify methods with zero references
- Remove unused methods

## Files to Analyze
### Services (23 files)
### Repositories (20+ files)  
### Utils (multiple helpers)

## Status
- [ ] Phase 1: Identify all service methods
- [ ] Phase 2: Find references to each method
- [ ] Phase 3: Remove unused service methods
- [ ] Phase 4: Repeat for repositories
- [ ] Phase 5: Repeat for utilities
fix errors, update serviice methods if you need to update repositories and models if you need, delete all unused methods