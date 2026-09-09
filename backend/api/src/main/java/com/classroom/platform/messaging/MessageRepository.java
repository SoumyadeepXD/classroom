package com.classroom.platform.messaging;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m JOIN FETCH m.author a WHERE m.channel.id = :channelId AND m.deletedAt IS NULL ORDER BY m.createdAt ASC")
    List<Message> findAllByChannelIdWithAuthor(@Param("channelId") UUID channelId, Pageable pageable);

    @Query("SELECT m FROM Message m JOIN FETCH m.author a WHERE m.parentMessageId = :parentMessageId AND m.deletedAt IS NULL ORDER BY m.createdAt ASC")
    List<Message> findAllByParentMessageIdWithAuthor(@Param("parentMessageId") UUID parentMessageId);
}
