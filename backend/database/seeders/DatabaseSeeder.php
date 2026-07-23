<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\Tag;
use App\Models\Member;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Members
        $member1 = Member::create([
            'name' => 'Alice Carter',
            'email' => 'alice@example.com',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
        ]);

        $member2 = Member::create([
            'name' => 'Bob Miller',
            'email' => 'bob@example.com',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
        ]);

        $member3 = Member::create([
            'name' => 'Charlie Smith',
            'email' => 'charlie@example.com',
            'avatar_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
        ]);

        // 2. Seed Tags
        $tagBug = Tag::create(['name' => 'Bug', 'color' => '#EF4444']); // Red
        $tagFeature = Tag::create(['name' => 'Feature', 'color' => '#3B82F6']); // Blue
        $tagRefactor = Tag::create(['name' => 'Refactor', 'color' => '#8B5CF6']); // Purple
        $tagUrgent = Tag::create(['name' => 'Urgent', 'color' => '#F59E0B']); // Amber
        $tagDocs = Tag::create(['name' => 'Docs', 'color' => '#10B981']); // Emerald

        // 3. Seed Boards
        $board = Board::create([
            'title' => 'Product Roadmap',
            'description' => 'Roadmap and task board for the software launch.'
        ]);

        // 4. Seed Lists
        $listToDo = BoardList::create([
            'board_id' => $board->id,
            'title' => 'To Do',
            'position' => 0
        ]);

        $listInProgress = BoardList::create([
            'board_id' => $board->id,
            'title' => 'In Progress',
            'position' => 1
        ]);

        $listDone = BoardList::create([
            'board_id' => $board->id,
            'title' => 'Done',
            'position' => 2
        ]);

        // 5. Seed Cards
        // Card 1
        $card1 = Card::create([
            'list_id' => $listToDo->id,
            'title' => 'Implement User Authentication',
            'description' => 'Integrate Laravel Sanctum for API token-based authentication.',
            'position' => 0,
            'due_date' => Carbon::now()->addDays(5)
        ]);
        $card1->tags()->attach([$tagFeature->id, $tagUrgent->id]);
        $card1->members()->attach([$member1->id, $member2->id]);

        // Card 2
        $card2 = Card::create([
            'list_id' => $listToDo->id,
            'title' => 'Design Board UI/UX mockup',
            'description' => 'Create a beautiful Figma design for our Kanban board.',
            'position' => 1,
            'due_date' => Carbon::now()->addDays(7)
        ]);
        $card2->tags()->attach([$tagFeature->id]);
        $card2->members()->attach([$member3->id]);

        // Card 3
        $card3 = Card::create([
            'list_id' => $listInProgress->id,
            'title' => 'Set up SQLite Database',
            'description' => 'Install and configure SQLite database, write migrations, and models.',
            'position' => 0,
            'due_date' => Carbon::now()->subDays(1) // Overdue!
        ]);
        $card3->tags()->attach([$tagRefactor->id, $tagUrgent->id]);
        $card3->members()->attach([$member1->id]);

        // Card 4
        $card4 = Card::create([
            'list_id' => $listInProgress->id,
            'title' => 'Draft API Documentation',
            'description' => 'Document all endpoints including Board, List, and Card APIs.',
            'position' => 1,
            'due_date' => null
        ]);
        $card4->tags()->attach([$tagDocs->id]);
        $card4->members()->attach([$member2->id]);

        // Card 5
        $card5 = Card::create([
            'list_id' => $listDone->id,
            'title' => 'Project Workspace Setup',
            'description' => 'Set up the monorepo structure for Laravel backend and React frontend.',
            'position' => 0,
            'due_date' => Carbon::now()->subDays(2)
        ]);
        $card5->tags()->attach([$tagRefactor->id]);
        $card5->members()->attach([$member1->id, $member2->id, $member3->id]);
    }
}
