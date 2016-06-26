<?php

/*
 * This file is part of Hifone.
 *
 * (c) Hifone.com <hifone@hifone.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Hifone\Handlers\Commands\Thread;

use Auth;
use Carbon\Carbon;
use Hifone\Commands\Thread\AddThreadCommand;
use Hifone\Events\Thread\ThreadWasAddedEvent;
use Hifone\Models\Thread;
use Hifone\Repositories\Contracts\TagRepositoryInterface;
<<<<<<< HEAD
use Hifone\Repositories\Contracts\ThreadRepositoryInterface;
=======
>>>>>>> 1.0
use Hifone\Services\Dates\DateFactory;

class AddThreadCommandHandler
{
    /**
     * The date factory instance.
     *
     * @var \Hifone\Services\Dates\DateFactory
     */
    protected $dates;

    /**
<<<<<<< HEAD
     * The thread instance.
     *
     * @var \Hifone\Repositories\Contracts\ThreadRepositoryInterface
     */
    protected $thread;

    /**
=======
>>>>>>> 1.0
     * The tag instance.
     *
     * @var \Hifone\Repositories\Contracts\TagRepositoryInterface
     */
    protected $tag;

    /**
     * Create a new report issue command handler instance.
     *
     * @param \Hifone\Services\Dates\DateFactory $dates
     */
<<<<<<< HEAD
    public function __construct(DateFactory $dates, ThreadRepositoryInterface $thread, TagRepositoryInterface $tag)
    {
        $this->dates = $dates;
        $this->thread = $thread;
=======
    public function __construct(DateFactory $dates, TagRepositoryInterface $tag)
    {
        $this->dates = $dates;
>>>>>>> 1.0
        $this->tag = $tag;
    }

    /**
     * Handle the report thread command.
     *
     * @param \Hifone\Commands\Thread\AddThreadCommand $command
     *
     * @return \Hifone\Models\Thread
     */
    public function handle(AddThreadCommand $command)
    {
        $data = [
            'user_id'       => $command->user_id,
            'title'         => $command->title,
            'excerpt'       => Thread::makeExcerpt($command->body),
            'node_id'       => $command->node_id,
            'body'          => app('parser.markdown')->convertMarkdownToHtml(app('parser.at')->parse($command->body)),
            'body_original' => $command->body,
            'created_at'    => Carbon::now()->toDateTimeString(),
            'updated_at'    => Carbon::now()->toDateTimeString(),
        ];
        // Create the thread
        $thread = $this->thread->create($data);

        // Update the node.
        if ($thread->node) {
            $thread->node->increment('thread_count', 1);
        }

        Auth::user()->increment('thread_count', 1);

        // The thread was added successfully, so now let's deal with the tags.
        $this->tag->attach($thread, $command->tags);

        event(new ThreadWasAddedEvent($thread));

        return $thread;
    }
}
